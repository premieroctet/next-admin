"use client";
import { isEqual } from "lodash";
import React, { PropsWithChildren, createContext, useEffect, useState } from "react";

type FormContextType = {
  formData: any;
  setFormData: (formData: any) => void;
  relationState?: {
    [P in string]: {
      open: boolean;
      selectedValue: { value: string; label: string } | { value: string; label: string }[];
    }
  };
  setOpen: (open: boolean, name: string) => void;
  toggleOpen: (name: string) => void;
  setSelectedValue: (selectedValue: any, name: string) => void;
}


export const FormContext = createContext<FormContextType>({
  formData: {},
  setFormData: (_formData: any) => { },
  relationState: {},
  setOpen: (_open: boolean, _name: string) => { },
  setSelectedValue: (_selectedValue: any, _name: string) => { },
  toggleOpen: (_name: string) => { },
});

type Props = PropsWithChildren<{
  initialValue: any;
}>

type RelationState = {
  [P in string]: {
    open: boolean;
    selectedValue: { value: string; label: string } | { value: string; label: string }[];
  }
}

export const FormProvider = ({ children, initialValue }: Props) => {
  const [formData, setFormData] = useState(initialValue);
  const [relationState, setRelationState] = useState<RelationState>({});
  useEffect(() => {
    const isDirty = !isEqual(initialValue, formData);
    const onBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = true
    }
    if (isDirty) {
      window.addEventListener('beforeunload', onBeforeUnload)
    }
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [formData, initialValue]);

  const setOpen = (open: boolean, name: string) => {
    if (!relationState) return;
    setRelationState((relationState) => ({
      ...relationState,
      [name]: {
        ...relationState[name],
        open,
      },
    }
    ));
  }

  const toggleOpen = (name: string) => {
    if (!relationState) return;
    setRelationState((relationState) => ({
      ...relationState,
      [name]: {
        ...relationState[name],
        open: !relationState[name]?.open,
      },
    }
    ));
  }

  const setSelectedValue = (selectedValue: any, name: string) => {
    if (!relationState) return;
    setRelationState((relationState) => ({
      ...relationState,
      [name]: {
        ...relationState[name],
        selectedValue,
      },
    }
    ));
  }
  
  return (
    <FormContext.Provider value={{ formData, setFormData, relationState, setOpen, setSelectedValue, toggleOpen }}>
      {children}
    </FormContext.Provider>
  );
}

export const useForm = () => {
  return React.useContext(FormContext);
};