import React, { useEffect } from "react";
import { SessionData } from "../types";
import "./recentShots.css";

export default function recentShots({
  sessionData,
}: {
  sessionData: SessionData;
}) {
  useEffect(() => {
    console.log(sessionData);
  }, []);
  return <div></div>;
}
