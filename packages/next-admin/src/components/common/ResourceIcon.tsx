"use client";
import * as OutlineIcons from "@heroicons/react/24/outline";
import { ModelIcon } from "../../types";
import { SVGProps } from "react";

type Props = SVGProps<HTMLOrSVGElement> & {
  icon: ModelIcon;
};

const ResourceIcon = ({ icon, ref, ...props }: Props) => {
  const Icon = OutlineIcons[icon];
  return <Icon {...props} />;
};

export default ResourceIcon;
