"use client";
import NProgress from "nprogress";
import { useEffect } from "react";
import * as NextNProgress from "nextjs-toploader";

const PageLoader = () => {
  useEffect(() => {
    NProgress.done();
  }, []);

  // I dont know why I need to do this
  // @ts-expect-error
  return <NextNProgress.default.default color="#6366f1" showSpinner={false} />;
};

export default PageLoader;
