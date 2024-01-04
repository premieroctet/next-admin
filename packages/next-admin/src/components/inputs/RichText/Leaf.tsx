import * as React from 'react';

interface LeafProps {
  attributes: any;
  children: React.ReactNode;
  leaf: any;
}

export const Leaf: React.FC<LeafProps> = ({ attributes, children, leaf }) => {
  let styledChildren = children;

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }

  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }

  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }

  return <span {...attributes}>{styledChildren}</span>;
};