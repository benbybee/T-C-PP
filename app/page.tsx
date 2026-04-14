import PolicyForm from "./components/PolicyForm";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Privacy Policy &amp; Terms Generator
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Fill out the form below to generate customized legal documents for your
          website.
        </p>
      </div>
      <PolicyForm />
    </main>
  );
}
