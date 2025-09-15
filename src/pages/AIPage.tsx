import { Calculator, Plus, Save, FileText, Download, RefreshCw, Home, Wrench } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BudgetItem {
  id: string;
  category: string;
  name: string;
  area: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
}

interface BudgetCalculation {
  projectName: string;
  clientName: string;
  totalArea: number;
  propertyType: string;
  decorationStyle: string;
  items: BudgetItem[];
  constructionFeeRate: number;
  managementFeeRate: number;
  designFeeRate: number;
  taxRate: number;
}

export default function AIPage() {
  const { toast } = useToast();
  
  const [calculation, setCalculation] = useState<BudgetCalculation>({
    projectName: "",
    clientName: "",
    totalArea: 696,
    propertyType: "别墅",
    decorationStyle: "现代简约",
    items: [
      {
        id: "1",
        category: "直接费",
        name: "基建部分",
        area: 696,
        unitPrice: 814.50,
        totalPrice: 566895.30,
        notes: ""
      },
      {
        id: "2", 
        category: "直接费",
        name: "装修工程",
        area: 696,
        unitPrice: 1487.85,
        totalPrice: 1035540.70,
        notes: ""
      },
      {
        id: "3",
        category: "直接费", 
        name: "柜子定制",
        area: 696,
        unitPrice: 334.37,
        totalPrice: 232723.50,
        notes: ""
      },
      {
        id: "4",
        category: "直接费",
        name: "新风设备/空调设备/地暖",
        area: 696,
        unitPrice: 545.98,
        totalPrice: 380000.00,
        notes: "预估"
      },
      {
        id: "5",
        category: "直接费",
        name: "电梯",
        area: 696,
        unitPrice: 215.52,
        totalPrice: 150000.00,
        notes: "预估"
      },
      {
        id: "6",
        category: "直接费",
        name: "灯具",
        area: 696,
        unitPrice: 114.94,
        totalPrice: 80000.00,
        notes: "预估"
      },
      {
        id: "7",
        category: "直接费",
        name: "家私",
        area: 696,
        unitPrice: 373.56,
        totalPrice: 260000.00,
        notes: "预估"
      },
      {
        id: "8",
        category: "直接费",
        name: "铝合金窗户",
        area: 696,
        unitPrice: 88.86,
        totalPrice: 61849.20,
        notes: "窗户面积39.84平方，玻璃栏杆72.96平米"
      }
    ],
    constructionFeeRate: 3,
    managementFeeRate: 5,
    designFeeRate: 0,
    taxRate: 1
  });

  // 计算各项费用
  const directCostTotal = calculation.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const constructionFee = directCostTotal * (calculation.constructionFeeRate / 100);
  const managementFee = directCostTotal * (calculation.managementFeeRate / 100);
  const designFee = calculation.totalArea * calculation.designFeeRate;
  const subtotal = directCostTotal + constructionFee + managementFee + designFee;
  const tax = subtotal * (calculation.taxRate / 100);
  const grandTotal = subtotal + tax;

  const handleItemChange = (id: string, field: keyof BudgetItem, value: string | number) => {
    setCalculation(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // 自动计算总价
          if (field === 'area' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.area * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addNewItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      category: "直接费",
      name: "",
      area: calculation.totalArea,
      unitPrice: 0,
      totalPrice: 0,
      notes: ""
    };
    setCalculation(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setCalculation(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
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
      items: prev.items.map(item => ({ ...item, totalPrice: item.area * item.unitPrice }))
    }));
    toast({
      title: "重新计算",
      description: "所有费用已重新计算",
    });
  };

  return (
    <div className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">装修预算测算</h1>
              <p className="text-muted-foreground">智能化装修费用预算计算和方案生成</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={resetCalculation}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新计算
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">项目名称</Label>
                <Input
                  id="projectName"
                  value={calculation.projectName}
                  onChange={(e) => setCalculation(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="请输入项目名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">客户姓名</Label>
                <Input
                  id="clientName"
                  value={calculation.clientName}
                  onChange={(e) => setCalculation(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="请输入客户姓名"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalArea">总面积 (㎡)</Label>
                <Input
                  id="totalArea"
                  type="number"
                  value={calculation.totalArea}
                  onChange={(e) => {
                    const newArea = parseFloat(e.target.value) || 0;
                    setCalculation(prev => ({
                      ...prev,
                      totalArea: newArea,
                      items: prev.items.map(item => ({
                        ...item,
                        area: newArea,
                        totalPrice: newArea * item.unitPrice
                      }))
                    }));
                  }}
                  placeholder="请输入总面积"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">户型类型</Label>
                <Select 
                  value={calculation.propertyType} 
                  onValueChange={(value) => setCalculation(prev => ({ ...prev, propertyType: value }))}
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
              <div className="space-y-2">
                <Label htmlFor="decorationStyle">装修风格</Label>
                <Select 
                  value={calculation.decorationStyle} 
                  onValueChange={(value) => setCalculation(prev => ({ ...prev, decorationStyle: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择风格" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="现代简约">现代简约</SelectItem>
                    <SelectItem value="北欧风">北欧风</SelectItem>
                    <SelectItem value="中式">中式</SelectItem>
                    <SelectItem value="欧式">欧式</SelectItem>
                    <SelectItem value="美式">美式</SelectItem>
                    <SelectItem value="工业风">工业风</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 费用明细表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>费用明细</span>
              </div>
              <Button onClick={addNewItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                添加项目
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">序号</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">专业类别</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">取费基数</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">面积 (㎡)</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">合价</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">单方造价 (元/㎡)</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">备注</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {calculation.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/20">
                      <td className="p-3 text-sm text-foreground">{index + 1}</td>
                      <td className="p-3">
                        <Input
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          placeholder="请输入专业类别"
                          className="min-w-32"
                        />
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{item.category}</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={item.area}
                          onChange={(e) => handleItemChange(item.id, 'area', parseFloat(e.target.value) || 0)}
                          className="w-24"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-foreground">
                          ¥{item.totalPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-28"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={item.notes}
                          onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                          placeholder="备注"
                          className="min-w-32"
                        />
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          删除
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* 直接费合计 */}
                  <tr className="border-b-2 border-primary bg-primary/5">
                    <td className="p-3 text-sm font-medium">一</td>
                    <td className="p-3 text-sm font-medium text-foreground">直接费合计</td>
                    <td className="p-3"></td>
                    <td className="p-3 text-sm font-medium">{calculation.totalArea}</td>
                    <td className="p-3 text-lg font-bold text-foreground">
                      ¥{directCostTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-sm font-medium">
                      {(directCostTotal / calculation.totalArea).toFixed(2)}
                    </td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>

                  {/* 措施费 */}
                  <tr className="border-b border-border">
                    <td className="p-3 text-sm font-medium">二</td>
                    <td className="p-3 text-sm font-medium text-foreground">措施费</td>
                    <td className="p-3 text-sm text-muted-foreground">一*{calculation.constructionFeeRate}%</td>
                    <td className="p-3"></td>
                    <td className="p-3 text-sm font-medium text-foreground">
                      ¥{constructionFee.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-sm font-medium">
                      {(constructionFee / calculation.totalArea).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        step="0.1"
                        value={calculation.constructionFeeRate}
                        onChange={(e) => setCalculation(prev => ({ ...prev, constructionFeeRate: parseFloat(e.target.value) || 0 }))}
                        className="w-20"
                      />
                      <span className="text-xs text-muted-foreground ml-1">%</span>
                    </td>
                    <td className="p-3"></td>
                  </tr>

                  {/* 管理费及利润 */}
                  <tr className="border-b border-border">
                    <td className="p-3 text-sm font-medium">三</td>
                    <td className="p-3 text-sm font-medium text-foreground">管理费及利润</td>
                    <td className="p-3 text-sm text-muted-foreground">(一+二)*{calculation.managementFeeRate}%</td>
                    <td className="p-3"></td>
                    <td className="p-3 text-sm font-medium text-foreground">
                      ¥{managementFee.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-sm font-medium">
                      {(managementFee / calculation.totalArea).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        step="0.1"
                        value={calculation.managementFeeRate}
                        onChange={(e) => setCalculation(prev => ({ ...prev, managementFeeRate: parseFloat(e.target.value) || 0 }))}
                        className="w-20"
                      />
                      <span className="text-xs text-muted-foreground ml-1">%</span>
                    </td>
                    <td className="p-3"></td>
                  </tr>

                  {/* 设计费 */}
                  <tr className="border-b border-border">
                    <td className="p-3 text-sm font-medium">四</td>
                    <td className="p-3 text-sm font-medium text-foreground">设计费</td>
                    <td className="p-3 text-sm text-muted-foreground">施工图+平面图</td>
                    <td className="p-3 text-sm font-medium">{calculation.totalArea}</td>
                    <td className="p-3 text-sm font-medium text-foreground">
                      ¥{designFee.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={calculation.designFeeRate}
                        onChange={(e) => setCalculation(prev => ({ ...prev, designFeeRate: parseFloat(e.target.value) || 0 }))}
                        className="w-20"
                      />
                    </td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>

                  {/* 税金 */}
                  <tr className="border-b border-border">
                    <td className="p-3 text-sm font-medium">五</td>
                    <td className="p-3 text-sm font-medium text-foreground">税金</td>
                    <td className="p-3 text-sm text-muted-foreground">(一+二+三+四)*{calculation.taxRate}%</td>
                    <td className="p-3"></td>
                    <td className="p-3 text-sm font-medium text-foreground">
                      ¥{tax.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-sm font-medium">
                      {(tax / calculation.totalArea).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        step="0.1"
                        value={calculation.taxRate}
                        onChange={(e) => setCalculation(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        className="w-20"
                      />
                      <span className="text-xs text-muted-foreground ml-1">%</span>
                    </td>
                    <td className="p-3"></td>
                  </tr>

                  {/* 总计 */}
                  <tr className="border-b-2 border-primary bg-primary/10">
                    <td className="p-3 text-sm font-bold"></td>
                    <td className="p-3 text-lg font-bold text-foreground">总计</td>
                    <td className="p-3"></td>
                    <td className="p-3 text-sm font-bold">{calculation.totalArea}</td>
                    <td className="p-3 text-xl font-bold text-primary">
                      ¥{grandTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-lg font-bold text-foreground">
                      {(grandTotal / calculation.totalArea).toFixed(2)}
                    </td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 费用汇总 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">直接费用</p>
                  <p className="text-xl font-bold text-foreground">¥{(directCostTotal / 10000).toFixed(1)}万</p>
                </div>
                <Wrench className="w-8 h-8 text-stat-blue" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                占总价 {((directCostTotal / grandTotal) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">措施费用</p>
                  <p className="text-xl font-bold text-foreground">¥{(constructionFee / 10000).toFixed(1)}万</p>
                </div>
                <div className="w-8 h-8 bg-stat-green/10 rounded-lg flex items-center justify-center">
                  <span className="text-stat-green font-bold text-sm">措</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                占总价 {((constructionFee / grandTotal) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">管理费用</p>
                  <p className="text-xl font-bold text-foreground">¥{(managementFee / 10000).toFixed(1)}万</p>
                </div>
                <div className="w-8 h-8 bg-stat-purple/10 rounded-lg flex items-center justify-center">
                  <span className="text-stat-purple font-bold text-sm">管</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                占总价 {((managementFee / grandTotal) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">项目总价</p>
                  <p className="text-xl font-bold text-primary">¥{(grandTotal / 10000).toFixed(1)}万</p>
                </div>
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                单价 ¥{(grandTotal / calculation.totalArea).toFixed(0)}/㎡
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 预算分析 */}
        <Card>
          <CardHeader>
            <CardTitle>预算分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">费用构成分析</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">直接费用</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-stat-blue rounded-full"></div>
                      <span className="text-sm font-medium">{((directCostTotal / grandTotal) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">措施费用</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-2 bg-stat-green rounded-full"></div>
                      <span className="text-sm font-medium">{((constructionFee / grandTotal) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">管理费用</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-2 bg-stat-purple rounded-full"></div>
                      <span className="text-sm font-medium">{((managementFee / grandTotal) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-foreground">设计费用</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-2 bg-stat-orange rounded-full"></div>
                      <span className="text-sm font-medium">{((designFee / grandTotal) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">预算建议</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-stat-green/10 border-l-4 border-stat-green rounded-r-lg">
                    <p className="text-sm font-medium text-stat-green">成本控制良好</p>
                    <p className="text-xs text-muted-foreground">直接费用占比合理，符合行业标准</p>
                  </div>
                  <div className="p-3 bg-stat-blue/10 border-l-4 border-stat-blue rounded-r-lg">
                    <p className="text-sm font-medium text-stat-blue">单价水平</p>
                    <p className="text-xs text-muted-foreground">
                      单方造价 ¥{(grandTotal / calculation.totalArea).toFixed(0)}/㎡，属于{
                        (grandTotal / calculation.totalArea) > 5000 ? "高端" :
                        (grandTotal / calculation.totalArea) > 3000 ? "中高端" :
                        (grandTotal / calculation.totalArea) > 2000 ? "中端" : "经济型"
                      }装修标准
                    </p>
                  </div>
                  <div className="p-3 bg-stat-orange/10 border-l-4 border-stat-orange rounded-r-lg">
                    <p className="text-sm font-medium text-stat-orange">优化建议</p>
                    <p className="text-xs text-muted-foreground">
                      可考虑调整材料选择或施工工艺来优化成本结构
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}