import type { ErrorText } from '../types/index'

function Error({ text }: ErrorText) {

  return (
    <div className="text-rose-800">
      Ошибка: {text}
    </div>
  );
}

export default Error