import {
  debounce_default,
  init_debounce,
  init_ownerDocument,
  init_ownerWindow,
  init_useControlled,
  init_useId,
  ownerDocument_default,
  ownerWindow_default,
  useControlled_default,
  useId_default
} from "./chunk-OLYQINQV.js";
import {
  createSvgIcon,
  init_createSvgIcon
} from "./chunk-UYZB5LT5.js";
import {
  init_requirePropFactory,
  requirePropFactory_default
} from "./chunk-CZFNWAR7.js";
import {
  init_useEnhancedEffect,
  useEnhancedEffect_default
} from "./chunk-CFNP3JQI.js";
import {
  init_useEventCallback,
  useEventCallback_default
} from "./chunk-S3NR7F3Z.js";
import {
  init_useForkRef,
  init_useIsFocusVisible,
  useForkRef_default,
  useIsFocusVisible_default
} from "./chunk-VGTJBQPL.js";
import {
  capitalize_default,
  init_capitalize
} from "./chunk-HI3B7SZC.js";
import {
  createChainedFunction,
  deprecatedPropType,
  init_createChainedFunction,
  init_deprecatedPropType,
  init_isMuiElement,
  init_setRef,
  init_unsupportedProp,
  init_utils,
  isMuiElement,
  setRef,
  unsupportedProp
} from "./chunk-VKPTLBTT.js";
import {
  ClassNameGenerator_default
} from "./chunk-YQDBUBUD.js";
import {
  __esm,
  __export
} from "./chunk-WXXH56N5.js";

// node_modules/@mui/material/utils/createChainedFunction.js
var createChainedFunction_default;
var init_createChainedFunction2 = __esm({
  "node_modules/@mui/material/utils/createChainedFunction.js"() {
    init_createChainedFunction();
    createChainedFunction_default = createChainedFunction;
  }
});

// node_modules/@mui/material/utils/deprecatedPropType.js
var deprecatedPropType_default;
var init_deprecatedPropType2 = __esm({
  "node_modules/@mui/material/utils/deprecatedPropType.js"() {
    init_deprecatedPropType();
    deprecatedPropType_default = deprecatedPropType;
  }
});

// node_modules/@mui/material/utils/isMuiElement.js
var isMuiElement_default;
var init_isMuiElement2 = __esm({
  "node_modules/@mui/material/utils/isMuiElement.js"() {
    init_isMuiElement();
    isMuiElement_default = isMuiElement;
  }
});

// node_modules/@mui/material/utils/setRef.js
var setRef_default;
var init_setRef2 = __esm({
  "node_modules/@mui/material/utils/setRef.js"() {
    init_setRef();
    setRef_default = setRef;
  }
});

// node_modules/@mui/material/utils/unsupportedProp.js
var unsupportedProp_default;
var init_unsupportedProp2 = __esm({
  "node_modules/@mui/material/utils/unsupportedProp.js"() {
    init_unsupportedProp();
    unsupportedProp_default = unsupportedProp;
  }
});

// node_modules/@mui/base/ClassNameGenerator/index.js
var init_ClassNameGenerator = __esm({
  "node_modules/@mui/base/ClassNameGenerator/index.js"() {
    init_utils();
  }
});

// node_modules/@mui/material/utils/index.js
var utils_exports = {};
__export(utils_exports, {
  capitalize: () => capitalize_default,
  createChainedFunction: () => createChainedFunction_default,
  createSvgIcon: () => createSvgIcon,
  debounce: () => debounce_default,
  deprecatedPropType: () => deprecatedPropType_default,
  isMuiElement: () => isMuiElement_default,
  ownerDocument: () => ownerDocument_default,
  ownerWindow: () => ownerWindow_default,
  requirePropFactory: () => requirePropFactory_default,
  setRef: () => setRef_default,
  unstable_ClassNameGenerator: () => unstable_ClassNameGenerator,
  unstable_useEnhancedEffect: () => useEnhancedEffect_default,
  unstable_useId: () => useId_default,
  unsupportedProp: () => unsupportedProp_default,
  useControlled: () => useControlled_default,
  useEventCallback: () => useEventCallback_default,
  useForkRef: () => useForkRef_default,
  useIsFocusVisible: () => useIsFocusVisible_default
});
var unstable_ClassNameGenerator;
var init_utils2 = __esm({
  "node_modules/@mui/material/utils/index.js"() {
    "use client";
    init_ClassNameGenerator();
    init_capitalize();
    init_createChainedFunction2();
    init_createSvgIcon();
    init_debounce();
    init_deprecatedPropType2();
    init_isMuiElement2();
    init_ownerDocument();
    init_ownerWindow();
    init_requirePropFactory();
    init_setRef2();
    init_useEnhancedEffect();
    init_useId();
    init_unsupportedProp2();
    init_useControlled();
    init_useEventCallback();
    init_useForkRef();
    init_useIsFocusVisible();
    unstable_ClassNameGenerator = {
      configure: (generator) => {
        if (true) {
          console.warn(["MUI: `ClassNameGenerator` import from `@mui/material/utils` is outdated and might cause unexpected issues.", "", "You should use `import { unstable_ClassNameGenerator } from '@mui/material/className'` instead", "", "The detail of the issue: https://github.com/mui/material-ui/issues/30011#issuecomment-1024993401", "", "The updated documentation: https://mui.com/guides/classname-generator/"].join("\n"));
        }
        ClassNameGenerator_default.configure(generator);
      }
    };
  }
});

export {
  createChainedFunction_default,
  init_createChainedFunction2 as init_createChainedFunction,
  deprecatedPropType_default,
  isMuiElement_default,
  init_isMuiElement2 as init_isMuiElement,
  setRef_default,
  unsupportedProp_default,
  init_unsupportedProp2 as init_unsupportedProp,
  unstable_ClassNameGenerator,
  utils_exports,
  init_utils2 as init_utils
};
//# sourceMappingURL=chunk-HNFZBFFY.js.map
