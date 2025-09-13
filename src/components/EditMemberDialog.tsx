import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface EditMemberFormData {
  name: string;
  role: string;
  phone: string;
  specialties: string[];
  rating: string;
  status: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  phone: string;
  specialties: string[];
  rating: number;
  status: string;
}

interface EditMemberDialogProps {
  member: TeamMember;
  children: React.ReactNode;
  onMemberUpdated?: () => void;
}

export function EditMemberDialog({ member, children, onMemberUpdated }: EditMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<EditMemberFormData>({
    name: member.name,
    role: member.role,
    phone: member.phone,
    specialties: member.specialties,
    rating: member.rating.toString(),
    status: member.status,
  });

  const availableSpecialties = ["水电", "瓦工", "木工", "防水", "安装", "管理"];
  const availableRoles = ["队长", "瓦工", "木工", "水电工", "安装工", "普工"];
  const availableStatuses = ["工作中", "待分配", "休息中"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.phone) {
      toast({
        title: "错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would update the member in Supabase
      toast({
        title: "更新成功",
        description: `成员 ${formData.name} 信息已更新`,
      });
      setOpen(false);
      onMemberUpdated?.();
    } catch (error) {
      toast({
        title: "错误",
        description: "更新成员失败，请重试",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof EditMemberFormData, value: string) => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>编辑成员信息 - {member.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="请输入姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">职位 *</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择职位" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">联系电话 *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="请输入联系电话"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">工作状态</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>专业技能</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableSpecialties.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty}
                    checked={formData.specialties.includes(specialty)}
                    onCheckedChange={() => toggleSpecialty(specialty)}
                  />
                  <Label
                    htmlFor={specialty}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">技能评分</Label>
            <Select value={formData.rating} onValueChange={(value) => handleInputChange("rating", value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择评分" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3.0">3.0 - 入门</SelectItem>
                <SelectItem value="3.5">3.5 - 熟练</SelectItem>
                <SelectItem value="4.0">4.0 - 良好</SelectItem>
                <SelectItem value="4.5">4.5 - 优秀</SelectItem>
                <SelectItem value="5.0">5.0 - 专家</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              更新信息
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}