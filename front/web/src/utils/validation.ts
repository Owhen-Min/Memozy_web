export const validateCollectionName = (name: string): { isValid: boolean; message: string } => {
  // SQL 인젝션 방지를 위한 특수문자 체크
  const specialChars = /[;'"\\]/;
  if (specialChars.test(name)) {
    return {
      isValid: false,
      message: "특수문자(;, ', \", \\)는 사용할 수 없습니다.",
    };
  }

  // 전체 길이 제한 (25자)
  if (name.length > 20) {
    return {
      isValid: false,
      message: "이름은 20자를 초과할 수 없습니다.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};
