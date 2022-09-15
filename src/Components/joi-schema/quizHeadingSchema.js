import Joi from "joi";

const emailRegEx = RegExp(
  "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$"
);

const object = {
  answerText: Joi.string().trim().min(1).message("attttt").required(),
  isCorrect: Joi.boolean().required(),
};

export const questionSchema = Joi.object({
  question: Joi.string().trim().min(3).required(),

  answerOptions: Joi.array()
    .unique((a, b) => a.answerText === b.answerText)
    .message("Duplicate options not to be submitted")
    .min(2)
    .message("Minimum 2 Options needed")
    .items(
      Joi.object(object).error(
        new Error("Cannot submit Empty options / answersddd")
      )
    ),
});

export const questionSchema1 = Joi.object({
  question: Joi.string()
    .trim()
    .min(3)
    .message("Question cannot be empty")
    .required()
    .error(new Error("Cannot empty Question or Options")),

  answerOptions: Joi.array()
    .unique((a, b) => a.answerText === b.answerText)
    .message("Duplicate options not to be submitted")
    .min(2)
    .message("Minimum 2 Options needed")
    .items(
      Joi.object(object).error(
        new Error("Cannot submit Empty options / answers")
      )
    ),
  answerCount: Joi.number().required(),
  hasMultiAns: Joi.boolean().required(),
});
export const userRegisterSchema = Joi.object({
  name: Joi.string().trim().min(3).required(),

  email: Joi.string()
    .trim()
    .pattern(/^[A-Za-z1-9_.]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{3,6}$/)
    .message("invalid email")
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .message({ meassge: "invalid email" }),

  password: Joi.string().min(6).required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .pattern(/^[A-Za-z1-9_.]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{3,6}$/)
    .rule({ message: "invalid email" })
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().min(6).required(),
});

export const quizHeading = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),
  question: questionSchema1,
});
