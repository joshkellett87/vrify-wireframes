import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { cn } from "../lib/utils";

interface ComparisonColumn {
  name: string;
  highlighted?: boolean;
  badge?: string;
}

interface ComparisonRow {
  feature: string;
  values: (string | boolean | ReactNode)[];
}

interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  className?: string;
}

/**
 * ComparisonTable - Feature comparison table for plans/tiers/options
 *
 * Common use cases:
 * - Pricing plan comparisons
 * - Feature matrices
 * - Product tier differentiation
 * - Option comparisons
 *
 * @param columns - Column definitions (name, highlighted, optional badge)
 * @param rows - Feature rows with values for each column
 * @param className - Additional CSS classes
 */
export const ComparisonTable = ({
  columns,
  rows,
  className,
}: ComparisonTableProps) => {
  return (
    <div className={cn("wireframe-section", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Feature</TableHead>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  "text-center",
                  column.highlighted && "bg-muted/50"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="font-semibold">{column.name}</span>
                  {column.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {column.badge}
                    </Badge>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell className="font-medium">{row.feature}</TableCell>
              {row.values.map((value, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={cn(
                    "text-center",
                    columns[colIndex]?.highlighted && "bg-muted/20"
                  )}
                >
                  {typeof value === "boolean" ? (
                    <span
                      className="inline-block text-lg"
                      aria-label={value ? "Yes" : "No"}
                    >
                      {value ? "✓" : "—"}
                    </span>
                  ) : (
                    value
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
