import React, { Suspense } from "react";
import Spinner from "../../../../views/spinner/Spinner.jsx";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;


