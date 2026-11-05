import type { Meta, StoryObj } from "@storybook/react";
import { BrandMark } from "@/components/studio/BrandMark";

const meta={title:"Foundations/Original Artist Mark",component:BrandMark,tags:["autodocs"],parameters:{layout:"padded"}} satisfies Meta<typeof BrandMark>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Ink:Story={render:()=> <div style={{maxWidth:650,padding:24,background:"#d8d9d2"}}><BrandMark/></div>};
export const Inverse:Story={render:()=> <div style={{maxWidth:650,padding:24,background:"#101210"}}><BrandMark inverse/></div>};
export const SmallScale:Story={render:()=> <div style={{width:160,padding:12,background:"#d8d9d2"}}><BrandMark/></div>};
