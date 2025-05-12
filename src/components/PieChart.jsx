import React from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";

const PieChart = ({ data }) => {
  return (
    <RechartsPieChart width={500} height={500}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={150}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
    </RechartsPieChart>
  );
};

export default PieChart;
