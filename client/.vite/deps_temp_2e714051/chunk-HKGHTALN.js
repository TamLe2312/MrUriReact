import {
  ButtonBase_default
} from "./chunk-CX6LEQFA.js";
import {
  ListContext_default
} from "./chunk-53KD5323.js";
import {
  init_useEnhancedEffect,
  useEnhancedEffect_default
} from "./chunk-CFNP3JQI.js";
import {
  init_useForkRef,
  useForkRef_default
} from "./chunk-VGTJBQPL.js";
import {
  init_styled,
  rootShouldForwardProp_default,
  styled_default
} from "./chunk-AGVSITQ3.js";
import {
  _extends,
  _objectWithoutPropertiesLoose,
  clsx_default,
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  init_clsx,
  init_composeClasses,
  init_extends,
  init_generateUtilityClass,
  init_generateUtilityClasses,
  init_objectWithoutPropertiesLoose,
  init_useThemeProps2 as init_useThemeProps,
  require_colorManipulator,
  require_jsx_runtime,
  useThemeProps2 as useThemeProps
} from "./chunk-YQDBUBUD.js";
import {
  require_prop_types
} from "./chunk-JNTERZHJ.js";
import {
  require_react
} from "./chunk-HAZNF34R.js";
import {
  __toESM
} from "./chunk-WXXH56N5.js";

// node_modules/@mui/material/ListItemButton/ListItemButton.js
init_objectWithoutPropertiesLoose();
init_extends();
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
init_clsx();
init_composeClasses();
var import_colorManipulator = __toESM(require_colorManipulator());
init_styled();
init_useThemeProps();
init_useEnhancedEffect();
init_useForkRef();

// node_modules/@mui/material/ListItemButton/listItemButtonClasses.js
init_generateUtilityClasses();
init_generateUtilityClass();
function getListItemButtonUtilityClass(slot) {
  return generateUtilityClass("MuiListItemButton", slot);
}
var listItemButtonClasses = generateUtilityClasses("MuiListItemButton", ["root", "focusVisible", "dense", "alignItemsFlexStart", "disabled", "divider", "gutters", "selected"]);
var listItemButtonClasses_default = listItemButtonClasses;

// node_modules/@mui/material/ListItemButton/ListItemButton.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded = ["alignItems", "autoFocus", "component", "children", "dense", "disableGutters", "divider", "focusVisibleClassName", "selected", "className"];
var overridesResolver = (props, styles) => {
  const {
    ownerState
  } = props;
  return [styles.root, ownerState.dense && styles.dense, ownerState.alignItems === "flex-start" && styles.alignItemsFlexStart, ownerState.divider && styles.divider, !ownerState.disableGutters && styles.gutters];
};
var useUtilityClasses = (ownerState) => {
  const {
    alignItems,
    classes,
    dense,
    disabled,
    disableGutters,
    divider,
    selected
  } = ownerState;
  const slots = {
    root: ["root", dense && "dense", !disableGutters && "gutters", divider && "divider", disabled && "disabled", alignItems === "flex-start" && "alignItemsFlexStart", selected && "selected"]
  };
  const composedClasses = composeClasses(slots, getListItemButtonUtilityClass, classes);
  return _extends({}, classes, composedClasses);
};
var ListItemButtonRoot = styled_default(ButtonBase_default, {
  shouldForwardProp: (prop) => rootShouldForwardProp_default(prop) || prop === "classes",
  name: "MuiListItemButton",
  slot: "Root",
  overridesResolver
})(({
  theme,
  ownerState
}) => _extends({
  display: "flex",
  flexGrow: 1,
  justifyContent: "flex-start",
  alignItems: "center",
  position: "relative",
  textDecoration: "none",
  minWidth: 0,
  boxSizing: "border-box",
  textAlign: "left",
  paddingTop: 8,
  paddingBottom: 8,
  transition: theme.transitions.create("background-color", {
    duration: theme.transitions.duration.shortest
  }),
  "&:hover": {
    textDecoration: "none",
    backgroundColor: (theme.vars || theme).palette.action.hover,
    // Reset on touch devices, it doesn't add specificity
    "@media (hover: none)": {
      backgroundColor: "transparent"
    }
  },
  [`&.${listItemButtonClasses_default.selected}`]: {
    backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})` : (0, import_colorManipulator.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    [`&.${listItemButtonClasses_default.focusVisible}`]: {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.focusOpacity}))` : (0, import_colorManipulator.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
    }
  },
  [`&.${listItemButtonClasses_default.selected}:hover`]: {
    backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity}))` : (0, import_colorManipulator.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
    // Reset on touch devices, it doesn't add specificity
    "@media (hover: none)": {
      backgroundColor: theme.vars ? `rgba(${theme.vars.palette.primary.mainChannel} / ${theme.vars.palette.action.selectedOpacity})` : (0, import_colorManipulator.alpha)(theme.palette.primary.main, theme.palette.action.selectedOpacity)
    }
  },
  [`&.${listItemButtonClasses_default.focusVisible}`]: {
    backgroundColor: (theme.vars || theme).palette.action.focus
  },
  [`&.${listItemButtonClasses_default.disabled}`]: {
    opacity: (theme.vars || theme).palette.action.disabledOpacity
  }
}, ownerState.divider && {
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundClip: "padding-box"
}, ownerState.alignItems === "flex-start" && {
  alignItems: "flex-start"
}, !ownerState.disableGutters && {
  paddingLeft: 16,
  paddingRight: 16
}, ownerState.dense && {
  paddingTop: 4,
  paddingBottom: 4
}));
var ListItemButton = React.forwardRef(function ListItemButton2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiListItemButton"
  });
  const {
    alignItems = "center",
    autoFocus = false,
    component = "div",
    children,
    dense = false,
    disableGutters = false,
    divider = false,
    focusVisibleClassName,
    selected = false,
    className
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
  const context = React.useContext(ListContext_default);
  const childContext = React.useMemo(() => ({
    dense: dense || context.dense || false,
    alignItems,
    disableGutters
  }), [alignItems, context.dense, dense, disableGutters]);
  const listItemRef = React.useRef(null);
  useEnhancedEffect_default(() => {
    if (autoFocus) {
      if (listItemRef.current) {
        listItemRef.current.focus();
      } else if (true) {
        console.error("MUI: Unable to set focus to a ListItemButton whose component has not been rendered.");
      }
    }
  }, [autoFocus]);
  const ownerState = _extends({}, props, {
    alignItems,
    dense: childContext.dense,
    disableGutters,
    divider,
    selected
  });
  const classes = useUtilityClasses(ownerState);
  const handleRef = useForkRef_default(listItemRef, ref);
  return (0, import_jsx_runtime.jsx)(ListContext_default.Provider, {
    value: childContext,
    children: (0, import_jsx_runtime.jsx)(ListItemButtonRoot, _extends({
      ref: handleRef,
      href: other.href || other.to,
      component: (other.href || other.to) && component === "div" ? "button" : component,
      focusVisibleClassName: clsx_default(classes.focusVisible, focusVisibleClassName),
      ownerState,
      className: clsx_default(classes.root, className)
    }, other, {
      classes,
      children
    }))
  });
});
true ? ListItemButton.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Defines the `align-items` style property.
   * @default 'center'
   */
  alignItems: import_prop_types.default.oneOf(["center", "flex-start"]),
  /**
   * If `true`, the list item is focused during the first mount.
   * Focus will also be triggered if the value changes from false to true.
   * @default false
   */
  autoFocus: import_prop_types.default.bool,
  /**
   * The content of the component if a `ListItemSecondaryAction` is used it must
   * be the last child.
   */
  children: import_prop_types.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types.default.object,
  /**
   * @ignore
   */
  className: import_prop_types.default.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types.default.elementType,
  /**
   * If `true`, compact vertical padding designed for keyboard and mouse input is used.
   * The prop defaults to the value inherited from the parent List component.
   * @default false
   */
  dense: import_prop_types.default.bool,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: import_prop_types.default.bool,
  /**
   * If `true`, the left and right padding is removed.
   * @default false
   */
  disableGutters: import_prop_types.default.bool,
  /**
   * If `true`, a 1px light border is added to the bottom of the list item.
   * @default false
   */
  divider: import_prop_types.default.bool,
  /**
   * This prop can help identify which element has keyboard focus.
   * The class name will be applied when the element gains the focus through keyboard interaction.
   * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
   * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
   * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
   * if needed.
   */
  focusVisibleClassName: import_prop_types.default.string,
  /**
   * @ignore
   */
  href: import_prop_types.default.string,
  /**
   * Use to apply selected styling.
   * @default false
   */
  selected: import_prop_types.default.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object])
} : void 0;
var ListItemButton_default = ListItemButton;

export {
  getListItemButtonUtilityClass,
  listItemButtonClasses_default,
  ListItemButton_default
};
//# sourceMappingURL=chunk-HKGHTALN.js.map
