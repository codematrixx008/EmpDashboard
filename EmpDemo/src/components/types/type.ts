import React from 'react'

export interface LblCustomType {
  text?: string,
  className?: string,
};

export interface BtnCustomType {
  text: any,
  className?: string,
  action?: () => void;
  disabled?: boolean;
};

export interface InputCustomType {
  inputType?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  border?:string;
};


export interface SelectPopupCustomType {
  options?: string[];
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  popupContent?: string;
  icon: React.ReactNode;
  border?:string;
};