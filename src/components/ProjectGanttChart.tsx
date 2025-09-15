import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle, PlayCircle, PauseCircle } from "lucide-react";
import { useProjectPhases, ProjectPhase } from "@/hooks/useProjectPhases";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format, addDays, differenceInDays, parseISO } from "date-fns";

interface ProjectGanttChartProps {
  projectId: string;
}

export function ProjectGanttChart({ projectId }: ProjectGanttChartProps) {
  const { phases, loading, updatePhaseStatus, updatePhaseProgress, updatePhaseDates } = useProjectPhases(projectId);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">加载项目进度...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成": return "text-stat-green bg-stat-green/10";
      case "进行中": return "text-stat-blue bg-stat-blue/10";
      case "暂停": return "text-stat-orange bg-stat-orange/10";
      case "未开始": return "text-muted-foreground bg-muted";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "已完成": return <CheckCircle className="w-4 h-4 text-stat-green" />;
      case "进行中": return <PlayCircle className="w-4 h-4 text-stat-blue" />;
      case "暂停": return <PauseCircle className="w-4 h-4 text-stat-orange" />;
      case "未开始": return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default: return <XCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const calculateGanttData = () => {
    if (phases.length === 0) return { startDate: new Date(), endDate: new Date(), totalDays: 0 };

    // 找到项目的开始和结束日期
    const today = new Date();
    let projectStart = today;
    let projectEnd = today;

    phases.forEach((phase, index) => {
      if (phase.start_date) {
        const phaseStart = parseISO(phase.start_date);
        if (index === 0) {
          projectStart = phaseStart;
        }
      } else if (index === 0) {
        // 第一个阶段没有开始日期，使用今天
        projectStart = today;
      } else {
        // 根据前一个阶段计算开始日期
        const prevPhase = phases[index - 1];
        if (prevPhase.end_date) {
          projectStart = addDays(parseISO(prevPhase.end_date), 1);
        }
      }

      if (phase.end_date) {
        projectEnd = parseISO(phase.end_date);
      } else {
        // 没有结束日期，根据预计工期计算
        const phaseStart = phase.start_date ? parseISO(phase.start_date) : 
          (index === 0 ? projectStart : addDays(parseISO(phases[index - 1].end_date || ''), 1));
        projectEnd = addDays(phaseStart, phase.estimated_duration);
      }
    });

    const totalDays = differenceInDays(projectEnd, projectStart) + 1;
    return { startDate: projectStart, endDate: projectEnd, totalDays };
  };

  const { startDate, endDate, totalDays } = calculateGanttData();

  const handleStatusChange = async (phaseId: string, newStatus: string) => {
    await updatePhaseStatus(phaseId, newStatus);
  };

  const handleProgressChange = async (phaseId: string, progress: string) => {
    const progressValue = parseInt(progress);
    if (progressValue >= 0 && progressValue <= 100) {
      await updatePhaseProgress(phaseId, progressValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          项目进度甘特图
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          项目周期：{format(startDate, 'yyyy-MM-dd')} - {format(endDate, 'yyyy-MM-dd')} ({totalDays} 天)
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无项目阶段数据
            </div>
          ) : (
            phases.map((phase, index) => {
              const phaseStartDate = phase.start_date ? parseISO(phase.start_date) : 
                (index === 0 ? startDate : addDays(parseISO(phases[index - 1].end_date || ''), 1));
              const phaseEndDate = phase.end_date ? parseISO(phase.end_date) : 
                addDays(phaseStartDate, phase.estimated_duration);
              
              const daysSinceStart = differenceInDays(phaseStartDate, startDate);
              const phaseDuration = differenceInDays(phaseEndDate, phaseStartDate) + 1;
              const leftPercentage = totalDays > 0 ? (daysSinceStart / totalDays) * 100 : 0;
              const widthPercentage = totalDays > 0 ? (phaseDuration / totalDays) * 100 : 0;

              return (
                <div key={phase.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(phase.status)}
                      <div>
                        <h4 className="font-medium">{phase.phase_name}</h4>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(phase.progress)}%
                      </span>
                    </div>
                  </div>

                  {/* 甘特图条 */}
                  <div className="relative h-6 bg-muted rounded">
                    <div
                      className="absolute h-full bg-gradient-primary rounded"
                      style={{
                        left: `${leftPercentage}%`,
                        width: `${widthPercentage}%`,
                      }}
                    >
                      <div
                        className="h-full bg-stat-green rounded"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-foreground font-medium">
                      {format(phaseStartDate, 'MM/dd')} - {format(phaseEndDate, 'MM/dd')}
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">进度</span>
                      <span className="font-medium">{Math.round(phase.progress)}%</span>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>

                  {/* 操作区域 */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">状态：</label>
                      <Select
                        value={phase.status}
                        onValueChange={(value) => handleStatusChange(phase.id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="未开始">未开始</SelectItem>
                          <SelectItem value="进行中">进行中</SelectItem>
                          <SelectItem value="已完成">已完成</SelectItem>
                          <SelectItem value="暂停">暂停</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">进度：</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(phase.progress)}
                        onChange={(e) => handleProgressChange(phase.id, e.target.value)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>预计 {phase.estimated_duration} 天</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}