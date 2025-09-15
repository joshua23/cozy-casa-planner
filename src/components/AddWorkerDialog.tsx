import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkers } from "@/hooks/useWorkers";

interface WorkerFormData {
  name: string;
  phone: string;
  workerType: string;
  specialties: string[];
  hourlyRate: string;
  dailyRate: string;
  skillRating: string;
}

export function AddWorkerDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<WorkerFormData>({
    name: "",
    phone: "",
    workerType: "",
    specialties: [],
    hourlyRate: "",
    dailyRate: "",
    skillRating: "0",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { createWorker } = useWorkers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.workerType) {
      toast({
        title: "错误",
        description: "请填写工人姓名和工种",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createWorker({
        name: formData.name,
        phone: formData.phone || null,
        worker_type: formData.workerType,
        specialties: formData.specialties,
        hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        daily_rate: formData.dailyRate ? parseFloat(formData.dailyRate) : null,
        skill_rating: parseInt(formData.skillRating),
        status: '空闲'
      });

      toast({
        title: "成功",
        description: "工人添加成功！",
      });

      setFormData({
        name: "",
        phone: "",
        workerType: "",
        specialties: [],
        hourlyRate: "",
        dailyRate: "",
        skillRating: "0",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding worker:', error);
      toast({
        title: "错误",
        description: "添加工人失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WorkerFormData, value: string | string[]) => {
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

  const availableSpecialties = ["泥瓦工", "木工", "水电工", "油漆工", "架子工", "杂工"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>新增工人</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新增工人信息</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">工人姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="请输入工人姓名"
                required
              />
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
              <Label htmlFor="workerType">工种 *</Label>
              <Select value={formData.workerType} onValueChange={(value) => handleInputChange("workerType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择工种" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="泥瓦工">泥瓦工</SelectItem>
                  <SelectItem value="木工">木工</SelectItem>
                  <SelectItem value="水电工">水电工</SelectItem>
                  <SelectItem value="油漆工">油漆工</SelectItem>
                  <SelectItem value="架子工">架子工</SelectItem>
                  <SelectItem value="杂工">杂工</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">时薪 (元/时)</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                placeholder="请输入时薪"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyRate">日薪 (元/天)</Label>
              <Input
                id="dailyRate"
                type="number"
                step="0.01"
                value={formData.dailyRate}
                onChange={(e) => handleInputChange("dailyRate", e.target.value)}
                placeholder="请输入日薪"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>专业技能</Label>
            <div className="grid grid-cols-4 gap-2">
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
              {loading ? "添加中..." : "添加工人"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}