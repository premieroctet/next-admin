import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { ComponentPropsWithRef } from 'react';
import {
  TableCell,
  TableRow
} from "./radix/Table";

interface SortableTableRowProps {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  grabElement?: React.ReactNode;
}

const SortableTableRow = ({ id, children, onClick, className, grabElement }: SortableTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
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
      onClick={onClick}
      className={className}
    >
      {grabElement && React.cloneElement(grabElement as React.ReactElement<ComponentPropsWithRef<typeof TableCell>>, {
        ref: setActivatorNodeRef,
        ...listeners
      })}
      {children}
    </TableRow>
  );
};

export default SortableTableRow;