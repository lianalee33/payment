import SignupForm from "@/app/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI 여행 플래너</h1>
          <p className="text-gray-500 mt-2">계정을 만들고 AI 여행 플래너를 시작하세요</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
