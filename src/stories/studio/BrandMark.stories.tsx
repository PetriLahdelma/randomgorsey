import type { Meta, StoryObj } from "@storybook/react";
import { BrandMark } from "@/components/studio/BrandMark";

const meta={title:"Foundations/Original Artist Mark",component:BrandMark,tags:["autodocs"],parameters:{layout:"padded",controls:{include:["inverse","alt","priority"]}},args:{inverse:false,alt:"Random Gorsey",priority:false},argTypes:{inverse:{control:"boolean",description:"Switches the mark to the light treatment for dark surfaces."},alt:{control:"text",description:"Accessible name for the artist mark."},priority:{control:"boolean",description:"Requests eager, high-priority image loading."},className:{control:false}}} satisfies Meta<typeof BrandMark>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Ink:Story={name:"Playground",render:(args)=> <div style={{maxWidth:650,padding:24,background:args.inverse?"#101210":"#d8d9d2"}}><BrandMark {...args}/></div>};
export const Inverse:Story={args:{inverse:true},render:(args)=> <div style={{maxWidth:650,padding:24,background:"#101210"}}><BrandMark {...args}/></div>};
export const SmallScale:Story={parameters:{controls:{disable:true}},render:()=> <div style={{width:160,padding:12,background:"#d8d9d2"}}><BrandMark/></div>};
