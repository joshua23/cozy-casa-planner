import { Calculator, Plus, Save, FileText, Download, RefreshCw, Home, Wrench } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetCalculation {
  projectName: string;
  clientName: string;
  totalArea: number;
  unitPrice: number;
  propertyType: string;
  decorationStyle: string;
  // 基础配置：3室2厅1厨1卫1阳台
  baseRooms: number;
  baseHalls: number;
  baseKitchens: number;
  baseBathrooms: number;
  baseBalconies: number;
  // 实际配置
  actualRooms: number;
  actualHalls: number;
  actualKitchens: number;
  actualBathrooms: number;
  actualBalconies: number;
}

export default function AIPage() {
  const { toast } = useToast();
  
  const [calculation, setCalculation] = useState<BudgetCalculation>({
    projectName: "",
    clientName: "",
    totalArea: 100,
    unitPrice: 1500,
    propertyType: "平层",
    decorationStyle: "现代简约",
    // 基础配置：3室2厅1厨1卫1阳台 = 15万基准
    baseRooms: 3,
    baseHalls: 2,
    baseKitchens: 1,
    baseBathrooms: 1,
    baseBalconies: 1,
    // 实际配置
    actualRooms: 3,
    actualHalls: 2,
    actualKitchens: 1,
    actualBathrooms: 1,
    actualBalconies: 1,
  });

  // 计算基础费用（按面积和单价）
  const baseCost = calculation.totalArea * calculation.unitPrice;

  // 计算户型增项费用
  const roomAddition = Math.max(0, calculation.actualRooms - calculation.baseRooms) * 10000;
  const hallAddition = Math.max(0, calculation.actualHalls - calculation.baseHalls) * 5000;
  const kitchenAddition = Math.max(0, calculation.actualKitchens - calculation.baseKitchens) * 8000;
  const bathroomAddition = Math.max(0, calculation.actualBathrooms - calculation.baseBathrooms) * 15000;
  const balconyAddition = Math.max(0, calculation.actualBalconies - calculation.baseBalconies) * 10000;

  const totalAdditions = roomAddition + hallAddition + kitchenAddition + bathroomAddition + balconyAddition;
  const finalTotal = baseCost + totalAdditions;

  const handleInputChange = (field: keyof BudgetCalculation, value: string | number) => {
    setCalculation(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "预算方案已保存",
    });
  };

  const handleExport = () => {
    toast({
      title: "导出成功", 
      description: "预算表已导出为Excel文件",
    });
  };

  const resetCalculation = () => {
    setCalculation(prev => ({
      ...prev,
      totalArea: 100,
      unitPrice: 1500,
      actualRooms: 3,
      actualHalls: 2,
      actualKitchens: 1,
      actualBathrooms: 1,
      actualBalconies: 1,
    }));
    toast({
      title: "重置成功",
      description: "已重置为标准配置",
    });
  };

  // 预设单价选项
  const unitPricePresets = [
    { value: 1500, label: "经济型 - ¥1,500/㎡", description: "基础装修，满足基本居住需求" },
    { value: 2000, label: "舒适型 - ¥2,000/㎡", description: "中等装修，品质与性价比平衡" },
    { value: 3000, label: "豪华型 - ¥3,000/㎡", description: "高端装修，追求品质与美观" },
  ];

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">装修预算测算</h1>
              <p className="text-muted-foreground">智能化装修费用预算计算，输入面积和户型即可快速测算</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={resetCalculation}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重置
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存方案
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 项目基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>项目基本信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">项目名称</Label>
                <Input
                  id="projectName"
                  value={calculation.projectName}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
                  placeholder="如：中冶别墅"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">客户姓名</Label>
                <Input
                  id="clientName"
                  value={calculation.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="如：沈先生"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalArea">总面积 (㎡) *</Label>
                <Input
                  id="totalArea"
                  type="number"
                  value={calculation.totalArea}
                  onChange={(e) => handleInputChange("totalArea", parseFloat(e.target.value) || 0)}
                  placeholder="请输入总面积"
                  className="text-lg font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">户型类型</Label>
                <Select 
                  value={calculation.propertyType} 
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择户型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="平层">平层</SelectItem>
                    <SelectItem value="小商品">小商品</SelectItem>
                    <SelectItem value="别墅">别墅</SelectItem>
                    <SelectItem value="办公室">办公室</SelectItem>
                    <SelectItem value="商业空间">商业空间</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 单价选择 */}
        <Card>
          <CardHeader>
            <CardTitle>装修标准选择</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {unitPricePresets.map((preset) => (
                <div 
                  key={preset.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    calculation.unitPrice === preset.value 
                      ? 'border-primary bg-primary/10 shadow-sm' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleInputChange("unitPrice", preset.value)}
                >
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-1">{preset.label}</h3>
                    <p className="text-xs text-muted-foreground">{preset.description}</p>
                    <div className="mt-2 text-lg font-bold text-primary">
                      {calculation.totalArea}㎡ = ¥{(calculation.totalArea * preset.value / 10000).toFixed(1)}万
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customUnitPrice">自定义单价 (元/㎡)</Label>
              <Input
                id="customUnitPrice"
                type="number"
                value={calculation.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", parseFloat(e.target.value) || 0)}
                placeholder="请输入自定义单价"
                className="text-lg font-medium"
              />
            </div>
          </CardContent>
        </Card>

        {/* 户型配置 */}
        <Card>
          <CardHeader>
            <CardTitle>户型配置</CardTitle>
            <p className="text-sm text-muted-foreground">
              基准配置：3室2厅1厨1卫1阳台，超出部分按以下标准加价
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actualRooms">房间数量</Label>
                <Input
                  id="actualRooms"
                  type="number"
                  min="1"
                  value={calculation.actualRooms}
                  onChange={(e) => handleInputChange("actualRooms", parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  超出{calculation.baseRooms}间，每间+¥1万
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualHalls">客厅数量</Label>
                <Input
                  id="actualHalls"
                  type="number"
                  min="1"
                  value={calculation.actualHalls}
                  onChange={(e) => handleInputChange("actualHalls", parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  超出{calculation.baseHalls}个，每个+¥0.5万
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualKitchens">厨房数量</Label>
                <Input
                  id="actualKitchens"
                  type="number"
                  min="1"
                  value={calculation.actualKitchens}
                  onChange={(e) => handleInputChange("actualKitchens", parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  超出{calculation.baseKitchens}个，每个+¥0.8万
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualBathrooms">卫生间数量</Label>
                <Input
                  id="actualBathrooms"
                  type="number"
                  min="1"
                  value={calculation.actualBathrooms}
                  onChange={(e) => handleInputChange("actualBathrooms", parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  超出{calculation.baseBathrooms}个，每个+¥1.5万
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualBalconies">阳台数量</Label>
                <Input
                  id="actualBalconies"
                  type="number"
                  min="0"
                  value={calculation.actualBalconies}
                  onChange={(e) => handleInputChange("actualBalconies", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  超出{calculation.baseBalconies}个，每个+¥1万
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 费用计算结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>费用计算结果</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 基础费用 */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">基础装修费用</h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">¥{(baseCost / 10000).toFixed(1)}万</p>
                    <p className="text-sm text-muted-foreground">{calculation.totalArea}㎡ × ¥{calculation.unitPrice}/㎡</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  包含：3室2厅1厨1卫1阳台的标准配置装修
                </p>
              </div>

              {/* 户型增项费用 */}
              {totalAdditions > 0 && (
                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">户型增项费用</h3>
                  <div className="space-y-2">
                    {roomAddition > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>增加房间 {calculation.actualRooms - calculation.baseRooms} 间</span>
                        <span className="font-medium">+¥{(roomAddition / 10000).toFixed(1)}万</span>
                      </div>
                    )}
                    {hallAddition > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>增加客厅 {calculation.actualHalls - calculation.baseHalls} 个</span>
                        <span className="font-medium">+¥{(hallAddition / 10000).toFixed(1)}万</span>
                      </div>
                    )}
                    {kitchenAddition > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>增加厨房 {calculation.actualKitchens - calculation.baseKitchens} 个</span>
                        <span className="font-medium">+¥{(kitchenAddition / 10000).toFixed(1)}万</span>
                      </div>
                    )}
                    {bathroomAddition > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>增加卫生间 {calculation.actualBathrooms - calculation.baseBathrooms} 个</span>
                        <span className="font-medium">+¥{(bathroomAddition / 10000).toFixed(1)}万</span>
                      </div>
                    )}
                    {balconyAddition > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>增加阳台 {calculation.actualBalconies - calculation.baseBalconies} 个</span>
                        <span className="font-medium">+¥{(balconyAddition / 10000).toFixed(1)}万</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>增项费用小计</span>
                        <span className="text-orange-600">+¥{(totalAdditions / 10000).toFixed(1)}万</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 总计 */}
              <div className="bg-gradient-primary text-primary-foreground p-6 rounded-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">装修总预算</h2>
                  <div className="text-4xl font-bold mb-2">¥{(finalTotal / 10000).toFixed(1)}万</div>
                  <p className="text-primary-foreground/80">
                    平均单价：¥{(finalTotal / calculation.totalArea).toFixed(0)}/㎡
                  </p>
                </div>
              </div>

              {/* 费用构成分析 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">费用构成</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-foreground">基础装修费用</span>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">¥{(baseCost / 10000).toFixed(1)}万</div>
                        <div className="text-xs text-muted-foreground">{((baseCost / finalTotal) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    {totalAdditions > 0 && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-foreground">户型增项费用</span>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">¥{(totalAdditions / 10000).toFixed(1)}万</div>
                          <div className="text-xs text-muted-foreground">{((totalAdditions / finalTotal) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">装修档次分析</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-stat-green/10 border-l-4 border-stat-green rounded-r-lg">
                      <p className="text-sm font-medium text-stat-green">
                        {calculation.unitPrice <= 1800 ? "经济实用型" :
                         calculation.unitPrice <= 2500 ? "舒适品质型" : "豪华精装型"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        单价 ¥{calculation.unitPrice}/㎡，符合该档次装修标准
                      </p>
                    </div>
                    <div className="p-3 bg-stat-blue/10 border-l-4 border-stat-blue rounded-r-lg">
                      <p className="text-sm font-medium text-stat-blue">户型配置</p>
                      <p className="text-xs text-muted-foreground">
                        {calculation.actualRooms}室{calculation.actualHalls}厅{calculation.actualKitchens}厨{calculation.actualBathrooms}卫{calculation.actualBalconies}阳台
                      </p>
                    </div>
                    <div className="p-3 bg-stat-purple/10 border-l-4 border-stat-purple rounded-r-lg">
                      <p className="text-sm font-medium text-stat-purple">预算建议</p>
                      <p className="text-xs text-muted-foreground">
                        建议预留10-15%的预算作为应急资金
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 快速调整 */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">快速调整</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleInputChange("unitPrice", 1500)}
                    className={calculation.unitPrice === 1500 ? "bg-primary text-primary-foreground" : ""}
                  >
                    ¥1,500/㎡
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleInputChange("unitPrice", 2000)}
                    className={calculation.unitPrice === 2000 ? "bg-primary text-primary-foreground" : ""}
                  >
                    ¥2,000/㎡
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleInputChange("unitPrice", 2500)}
                    className={calculation.unitPrice === 2500 ? "bg-primary text-primary-foreground" : ""}
                  >
                    ¥2,500/㎡
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleInputChange("unitPrice", 3000)}
                    className={calculation.unitPrice === 3000 ? "bg-primary text-primary-foreground" : ""}
                  >
                    ¥3,000/㎡
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}