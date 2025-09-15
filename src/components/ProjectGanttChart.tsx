import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle, PlayCircle, PauseCircle } from "lucide-react";
import { useProjectPhases, ProjectPhase } from "@/hooks/useProjectPhases";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format, addDays, differenceInDays, parseISO, isValid } from "date-fns";

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
    if (phases.length === 0) return { startDate: new Date(), endDate: new Date(), totalDays: 1 };

    const today = new Date();
    let projectStart = today;
    let projectEnd = today;

    try {
      phases.forEach((phase, index) => {
        // 处理开始日期
        if (phase.start_date && phase.start_date.trim() !== '') {
          try {
            const phaseStart = parseISO(phase.start_date);
            if (!isNaN(phaseStart.getTime())) {
              if (index === 0) {
                projectStart = phaseStart;
              }
            }
          } catch (e) {
            console.warn('Invalid start_date:', phase.start_date);
          }
        } else if (index === 0) {
          projectStart = today;
        } else {
          // 根据前一个阶段计算开始日期
          const prevPhase = phases[index - 1];
          if (prevPhase.end_date && prevPhase.end_date.trim() !== '') {
            try {
              const prevEndDate = parseISO(prevPhase.end_date);
              if (!isNaN(prevEndDate.getTime())) {
                projectStart = addDays(prevEndDate, 1);
              }
            } catch (e) {
              console.warn('Invalid prev end_date:', prevPhase.end_date);
            }
          }
        }

        // 处理结束日期
        if (phase.end_date && phase.end_date.trim() !== '') {
          try {
            const phaseEnd = parseISO(phase.end_date);
            if (!isNaN(phaseEnd.getTime())) {
              projectEnd = phaseEnd;
            }
          } catch (e) {
            console.warn('Invalid end_date:', phase.end_date);
          }
        } else {
          // 没有结束日期，根据预计工期计算
          const duration = phase.estimated_duration || 1;
          let phaseStart = projectStart;
          
          if (phase.start_date && phase.start_date.trim() !== '') {
            try {
              const parsedStart = parseISO(phase.start_date);
              if (!isNaN(parsedStart.getTime())) {
                phaseStart = parsedStart;
              }
            } catch (e) {
              console.warn('Invalid phase start_date:', phase.start_date);
            }
          } else if (index > 0) {
            const prevPhase = phases[index - 1];
            if (prevPhase.end_date && prevPhase.end_date.trim() !== '') {
              try {
                const prevEndDate = parseISO(prevPhase.end_date);
                if (!isNaN(prevEndDate.getTime())) {
                  phaseStart = addDays(prevEndDate, 1);
                }
              } catch (e) {
                console.warn('Invalid prev phase end_date:', prevPhase.end_date);
              }
            }
          }
          
          projectEnd = addDays(phaseStart, duration);
        }
      });

      const totalDays = Math.max(1, differenceInDays(projectEnd, projectStart) + 1);
      return { startDate: projectStart, endDate: projectEnd, totalDays };
    } catch (error) {
      console.error('Error calculating gantt data:', error);
      return { startDate: today, endDate: addDays(today, 30), totalDays: 30 };
    }
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
          项目周期：{startDate && !isNaN(startDate.getTime()) ? format(startDate, 'yyyy-MM-dd') : '未设定'} - {endDate && !isNaN(endDate.getTime()) ? format(endDate, 'yyyy-MM-dd') : '未设定'} ({totalDays} 天)
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
              // 安全地处理日期解析
              let phaseStartDate = startDate;
              let phaseEndDate = endDate;
              
              try {
                if (phase.start_date && phase.start_date.trim() !== '') {
                  const parsedStart = parseISO(phase.start_date);
                  if (!isNaN(parsedStart.getTime())) {
                    phaseStartDate = parsedStart;
                  }
                } else if (index === 0) {
                  phaseStartDate = startDate;
                } else {
                  const prevPhase = phases[index - 1];
                  if (prevPhase.end_date && prevPhase.end_date.trim() !== '') {
                    const prevEndDate = parseISO(prevPhase.end_date);
                    if (!isNaN(prevEndDate.getTime())) {
                      phaseStartDate = addDays(prevEndDate, 1);
                    }
                  }
                }

                if (phase.end_date && phase.end_date.trim() !== '') {
                  const parsedEnd = parseISO(phase.end_date);
                  if (!isNaN(parsedEnd.getTime())) {
                    phaseEndDate = parsedEnd;
                  }
                } else {
                  const duration = phase.estimated_duration || 1;
                  phaseEndDate = addDays(phaseStartDate, duration);
                }
              } catch (error) {
                console.warn('Error parsing phase dates:', error);
                phaseStartDate = startDate;
                phaseEndDate = addDays(startDate, phase.estimated_duration || 1);
              }
              
              const daysSinceStart = Math.max(0, differenceInDays(phaseStartDate, startDate));
              const phaseDuration = Math.max(1, differenceInDays(phaseEndDate, phaseStartDate) + 1);
              const leftPercentage = totalDays > 0 ? Math.min(100, (daysSinceStart / totalDays) * 100) : 0;
              const widthPercentage = totalDays > 0 ? Math.min(100, (phaseDuration / totalDays) * 100) : 0;

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
                      {phaseStartDate && !isNaN(phaseStartDate.getTime()) ? format(phaseStartDate, 'MM/dd') : '--'} - {phaseEndDate && !isNaN(phaseEndDate.getTime()) ? format(phaseEndDate, 'MM/dd') : '--'}
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