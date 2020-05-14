type UserValidationErrors = {
  firstnameInvalid?: string;
  lastnameInvalid?: string;
  emailEmpty?: string;
  emailInvalid?: string;
  ageInvalid?: string;
  phonenumberInvalid?: string;
};

enum UserValidationErrorMessages {
  FIRST_NAME_INVALID = "First name is not valid. Please provide a name which is at least 2 characters long.",
  LAST_NAME_INVALID = "Last name is not valid. Please provide a name which is at least 2 characters long.",
  EMAIL_EMPTY = "Please provide an email address.",
  EMAIL_INVALID = "Please provide a valid email address",
  AGE_INVALID = "Please provide a valid number for the age.",
  PHONENUMBER_INVALID = "Please provide a valid number for the phone number which is at least 6 digits long.",
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function validateInput({ firstname, lastname, age, email, phonenumber }: any) {
  let errors: UserValidationErrors = {};

  if (!firstname || firstname.trim().length < 2)
    errors.firstnameInvalid = UserValidationErrorMessages.FIRST_NAME_INVALID;

  if (!lastname || lastname.trim().length < 2)
    errors.lastnameInvalid = UserValidationErrorMessages.LAST_NAME_INVALID;

  if (!email || email.trim().length == 0)
    errors.emailEmpty = UserValidationErrorMessages.EMAIL_EMPTY;

  if (!email || !emailRegex.test(email))
    errors.emailInvalid = UserValidationErrorMessages.EMAIL_INVALID;

  if (!isNaN || isNaN(age))
    errors.ageInvalid = UserValidationErrorMessages.AGE_INVALID;

  if (!age || age < 0)
    errors.ageInvalid = UserValidationErrorMessages.AGE_INVALID;

  if (!isNaN || isNaN(phonenumber))
    errors.phonenumberInvalid = UserValidationErrorMessages.PHONENUMBER_INVALID;

  if (!phonenumber || phonenumber < 100000)
    errors.phonenumberInvalid = UserValidationErrorMessages.PHONENUMBER_INVALID;

  return Object.keys(errors).length > 0 ? errors : null;
}

export default (payload: any) => {
  const inputErrors = validateInput(payload);
  return {
    valid: inputErrors ? false : true,
    data: inputErrors ? inputErrors : Object.freeze(payload),
  };
};
