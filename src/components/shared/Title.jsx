import React from "react";
import { Helmet } from "react-helmet-async";
const Title = ({
  title = "Chit-Chat",
  description = "Welcome to Chit-Chat",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
