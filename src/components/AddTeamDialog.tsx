import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TeamFormData {
  teamName: string;
  teamLeader: string;
  teamLeaderPhone: string;
  teamSize: string;
  specialties: string[];
  pricingModel: string;
  efficiencyRating: string;
}

export function AddTeamDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TeamFormData>({
    teamName: "",
    teamLeader: "",
    teamLeaderPhone: "",
    teamSize: "",
    specialties: [],
    pricingModel: "",
    efficiencyRating: "0",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teamName || !formData.teamLeader) {
      toast({
        title: "错误",
        description: "请填写团队名称和负责人",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "错误",
          description: "请先登录",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('construction_teams')
        .insert({
          team_name: formData.teamName,
          team_leader: formData.teamLeader,
          team_leader_phone: formData.teamLeaderPhone,
          team_size: formData.teamSize ? parseInt(formData.teamSize) : 0,
          specialties: formData.specialties,
          pricing_model: formData.pricingModel,
          efficiency_rating: parseInt(formData.efficiencyRating),
          status: '空闲',
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "成功",
        description: "施工团队添加成功！",
      });

      setFormData({
        teamName: "",
        teamLeader: "",
        teamLeaderPhone: "",
        teamSize: "",
        specialties: [],
        pricingModel: "",
        efficiencyRating: "0",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding team:', error);
      toast({
        title: "错误",
        description: "添加施工团队失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TeamFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const availableSpecialties = ["水电工程", "泥工工程", "木工工程", "油漆工程", "安装工程", "防水工程", "装饰工程"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium shadow-card hover:shadow-elevated transition-all duration-smooth flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>新建团队</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新建施工团队</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">团队名称 *</Label>
              <Input
                id="teamName"
                value={formData.teamName}
                onChange={(e) => handleInputChange("teamName", e.target.value)}
                placeholder="请输入团队名称"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamLeader">团队负责人 *</Label>
              <Input
                id="teamLeader"
                value={formData.teamLeader}
                onChange={(e) => handleInputChange("teamLeader", e.target.value)}
                placeholder="请输入负责人姓名"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamLeaderPhone">负责人电话</Label>
              <Input
                id="teamLeaderPhone"
                value={formData.teamLeaderPhone}
                onChange={(e) => handleInputChange("teamLeaderPhone", e.target.value)}
                placeholder="请输入负责人电话"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamSize">团队人数</Label>
              <Input
                id="teamSize"
                type="number"
                value={formData.teamSize}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
                placeholder="请输入团队人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricingModel">计价模式</Label>
              <Select value={formData.pricingModel} onValueChange={(value) => handleInputChange("pricingModel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择计价模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="包工包料">包工包料</SelectItem>
                  <SelectItem value="包工不包料">包工不包料</SelectItem>
                  <SelectItem value="按天计价">按天计价</SelectItem>
                  <SelectItem value="按项目计价">按项目计价</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="efficiencyRating">效率评级</Label>
              <Select value={formData.efficiencyRating} onValueChange={(value) => handleInputChange("efficiencyRating", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择效率评级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1星 - 一般</SelectItem>
                  <SelectItem value="2">2星 - 良好</SelectItem>
                  <SelectItem value="3">3星 - 优秀</SelectItem>
                  <SelectItem value="4">4星 - 出色</SelectItem>
                  <SelectItem value="5">5星 - 卓越</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>专业领域</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableSpecialties.map((specialty) => (
                <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(specialty)}
                    onChange={() => toggleSpecialty(specialty)}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{specialty}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "创建中..." : "创建团队"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}