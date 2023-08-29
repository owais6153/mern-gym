import paymentMethodModel from "../../database/models/payment.method.model.js";

const findAll = async () => {
  const resp = await paymentMethodModel.find();
  return { data: resp };
};

const findBySlug = async (req) => {
  const resp = await paymentMethodModel.findOne({ slug: req });
  return { data: resp };
};

const PaymentMethodService = {
  findAll,
  findBySlug
};
export default PaymentMethodService;
