import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  TableRow
} from "./radix/Table";

interface SortableTableRowProps {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SortableTableRow = ({ id, children, onClick, className }: SortableTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={className}
    >
      {children}
    </TableRow>
  );
}

export default SortableTableRow;