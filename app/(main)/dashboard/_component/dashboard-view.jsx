"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// A more robust, theme-aware custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {`$${entry.value}K`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardView = ({ insights }) => {
  // --- Data Transformations (Logic Unchanged) ---
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  // --- UI Helper Functions (Improved for better component variants) ---
  const getDemandLevelVariant = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "success";
      case "medium":
        return "warning";
      case "low":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-slate-500" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(insights.marketOutlook);

  // --- Date Formatting (Logic Unchanged) ---
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "MMMM d, yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="bg-muted/40 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Market Insights Dashboard</h1>
          <p className="text-muted-foreground">
            An overview of the current industry landscape.
          </p>
        </div>
        <div className="text-sm text-muted-foreground text-right">
          <p>Last updated: {lastUpdatedDate}</p>
          <p>Next update {nextUpdateDistance}</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <OutlookIcon className={`h-5 w-5 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${outlookColor}`}>{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">Overall industry sentiment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</div>
            <Progress value={insights.growthRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getDemandLevelVariant(insights.demandLevel)} className="text-lg">
              {insights.demandLevel}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Current demand for professionals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mt-1">
              {insights.topSkills.slice(0, 5).map((skill) => ( // Show top 5 for cleaner UI
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid (Chart and Lists) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Salary Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <CardDescription>
              Minimum, median, and maximum salaries shown in thousands (e.g., $100K).
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={salaryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}K`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
                <Legend iconType="circle" />
                <Bar dataKey="min" name="Min Salary" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="median" name="Median Salary" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" name="Max Salary" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trends and Skills */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Key Industry Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {insights.keyTrends.map((trend, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ChevronRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{trend}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" /> Recommended Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.recommendedSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;