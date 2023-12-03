"use client";

import React, { ReactNode } from "react";
import { SWRConfig } from "swr";

export const SWRProvider = ({ children }: { children: ReactNode }) => {
  return <SWRConfig>{children}</SWRConfig>;
};
