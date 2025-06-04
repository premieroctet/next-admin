"use client";
import NProgress from "nprogress";
import { useEffect } from "react";
import * as NextNProgress from "nextjs-toploader";

/**
 * Compat with TurboPack and non TurboPack
 */
const NextNProgressDefault =
  "default" in NextNProgress.default
    ? // @ts-expect-error
      NextNProgress.default.default
    : NextNProgress.default;

const PageLoader = () => {
  useEffect(() => {
    NProgress.done();
  }, []);

  return <NextNProgressDefault color="#6366f1" showSpinner={false} />;
};

export default PageLoader;
