import React from "react";

export const getServerSideProps = async () => {
  try {
    const response = await fetch("/api/handler", {
      method: "GET",
    });
    const data = await response.json();
    return { props: { data } };
  } catch (error) {}
};

const test = () => {
  return (
      <div>test</div>
  );

};

export default test;
