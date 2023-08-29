const paymentMethodDto = (data) => {
  return {
    id: data?._id,
    slug: data?.slug,
    title: data?.title,
    createdAt: data?.createdAt,
  };
};
export default paymentMethodDto;
