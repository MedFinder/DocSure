import { objectAccessor } from "./object";
import { FormikErrors, FormikTouched, FormikValues } from "formik";

export function getFormikTextFieldHelperText<T extends FormikValues>(
  formik: {
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
  },
  key: keyof T,
  helperText?: string
): string | undefined {
  const keyString = key as string;
  return !!objectAccessor(formik.touched, keyString) &&
    objectAccessor(formik.errors, keyString)
    ? objectAccessor(formik.errors, keyString)
    : helperText;
}

export function getFormikTextFieldError<T extends FormikValues>(
  formik: {
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
  },
  key: keyof T
): boolean {
  const keyString = key as string;
  return (
    !!objectAccessor(formik.touched, keyString) &&
    !!objectAccessor(formik.errors, keyString)
  );
}

export function getFormikTextFieldHelperTextAndErrorProps<
  T extends FormikValues
>(
  formik: {
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
  },
  key: keyof T,
  helperText?: string
) {
  return {
    error: getFormikTextFieldError(formik, key),
    helperText: getFormikTextFieldHelperText(formik, key, helperText),
  };
}

export function getFormikTextFieldProps<T extends FormikValues>(
  formik: {
    getFieldProps: (key: keyof T) => any;
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
  },
  key: keyof T,
  helperText?: string
) {
  return {
    ...formik.getFieldProps(key),
    ...getFormikTextFieldHelperTextAndErrorProps(formik, key, helperText),
  };
}

export function getFormikCheckFieldProps<T extends FormikValues>(
  formik: {
    getFieldProps: (key: keyof T) => any;
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
  },
  key: keyof T,
  checkedValue: any = true
  // unCheckedValue = false
) {
  const textFieldProps = getFormikTextFieldProps(formik, key);

  const value =
    typeof checkedValue === "boolean"
      ? !!textFieldProps.value
      : textFieldProps.value;

  return {
    ...textFieldProps,
    value: value,
    checked: value === checkedValue,
  };
  // return {
  //   checked: !!formik.values[key],
  //   onChange: (e) => formik.setFieldValue(key, e.target.checked),
  // };
}
