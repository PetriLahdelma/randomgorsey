import React from "react";

interface PageMetaProps {
  title: string;
  description?: string;
  path?: string;
}

const PageMeta: React.FC<PageMetaProps> = ({ title, description, path }) => {
  void title;
  void description;
  void path;

  return null;
};

export default PageMeta;
