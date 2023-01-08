import * as Yup from "yup";

export const contactSchema = Yup.object().shape({
    fullname: Yup.string().required("نام الزامی است"),
    photo: Yup.string().required("تصویر مخاطب الزامی میباشد"),
    mobile: Yup.number().required("شماره موبایل الزامی کیباشد"),
    email: Yup.string().email("آدرس ایمیل معتبر نیست").required("آدرس ایمیل الزامی میباشد"),
    job: Yup.string().nullable(),
    group: Yup.string().required("انتخاب گروه الزامی میباشد"),
});