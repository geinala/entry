type TResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export async function actionWrapper<TData>(
  action: () => Promise<TData>,
  successMessage: string = "Berhasil"
): Promise<TResponse<TData>> {
  try {
    const data = await action();

    return {
      success: true,
      message: successMessage,
      data: data,
    };
  } catch (error: unknown) {
    // TODO: Add logging mechanism here

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan internal server.";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
