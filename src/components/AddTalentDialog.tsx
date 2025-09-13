import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TalentFormData {
  name: string;
  phone: string;
  email: string;
  role: string;
  specialties: string[];
  experienceYears: string;
  skillRating: string;
  notes: string;
  status: string;
}

export function AddTalentDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TalentFormData>({
    name: "",
    phone: "",
    email: "",
    role: "",
    specialties: [],
    experienceYears: "0",
    skillRating: "0",
    notes: "",
    status: "潜在",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role) {
      toast({
        title: "错误",
        description: "请填写人才姓名和职位",
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
        .from('talents')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          role: formData.role,
          specialties: formData.specialties,
          experience_years: parseInt(formData.experienceYears),
          skill_rating: parseInt(formData.skillRating),
          notes: formData.notes,
          status: formData.status,
          user_id: user.id,
          last_contact_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "成功",
        description: "人才信息添加成功！",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        role: "",
        specialties: [],
        experienceYears: "0",
        skillRating: "0",
        notes: "",
        status: "潜在",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding talent:', error);
      toast({
        title: "错误",
        description: "添加人才信息失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TalentFormData, value: string | string[]) => {
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

  const availableSpecialties = ["室内设计", "景观设计", "建筑设计", "软装设计", "家居设计", "商业设计", "工装设计"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>新增人才</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新增人才信息</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="请输入姓名"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">职位 *</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择职位" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="首席设计师">首席设计师</SelectItem>
                  <SelectItem value="主任设计师">主任设计师</SelectItem>
                  <SelectItem value="资深设计师">资深设计师</SelectItem>
                  <SelectItem value="设计师">设计师</SelectItem>
                  <SelectItem value="助理设计师">助理设计师</SelectItem>
                  <SelectItem value="项目经理">项目经理</SelectItem>
                  <SelectItem value="监理">监理</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">联系电话</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="请输入联系电话"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="请输入邮箱地址"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceYears">工作经验 (年)</Label>
              <Input
                id="experienceYears"
                type="number"
                value={formData.experienceYears}
                onChange={(e) => handleInputChange("experienceYears", e.target.value)}
                placeholder="请输入工作年限"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillRating">技能评级</Label>
              <Select value={formData.skillRating} onValueChange={(value) => handleInputChange("skillRating", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择技能评级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1星 - 初级</SelectItem>
                  <SelectItem value="2">2星 - 入门</SelectItem>
                  <SelectItem value="3">3星 - 熟练</SelectItem>
                  <SelectItem value="4">4星 - 精通</SelectItem>
                  <SelectItem value="5">5星 - 专家</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="status">状态</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="在职">在职</SelectItem>
                  <SelectItem value="离职">离职</SelectItem>
                  <SelectItem value="潜在">潜在</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>专业技能</Label>
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

          <div className="space-y-2">
            <Label htmlFor="notes">备注</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="请输入备注信息"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "添加中..." : "添加人才"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}