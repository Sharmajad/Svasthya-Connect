import React from "react";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <SearchBar />
      <Features />
      <ConsultSection />
      <Specialities />
      <Articles />
      <Testimonials />
      <FloatingButton />
    </div>
  );
}



function SearchBar() {
  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white p-4 rounded-xl shadow-md flex gap-4 w-[60%]">
        <input placeholder="📍 Enter location" className="border px-3 py-2 rounded-lg w-1/3" />
        <input placeholder="🔍 Search doctors..." className="border px-3 py-2 rounded-lg w-1/2" />
        <button className="bg-teal-500 text-white px-6 rounded-lg">Search</button>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    "Instant Video Consultation",
    "Find Doctors Near You",
    "Lab Tests",
    "Surgeries",
  ];

  return (
    <div className="grid grid-cols-4 gap-6 px-10 mt-10">
      {features.map((f, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-md">
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <h2 className="font-semibold">{f}</h2>
        </div>
      ))}
    </div>
  );
}

function ConsultSection() {
  const items = [
    "Period doubts",
    "Skin issues",
    "Performance issues",
    "Cold & fever",
    "Child care",
    "Mental health",
  ];

  return (
    <div className="px-10 mt-16">
      <h1 className="text-3xl font-bold mb-6">
        Consult top doctors online
      </h1>
      <div className="grid grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
            <h2>{item}</h2>
            <p className="text-teal-600 mt-2">Consult Now →</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Specialities() {
  return (
    <div className="px-10 mt-16">
      <h1 className="text-3xl font-bold mb-6">
        Book appointment by speciality
      </h1>
      <div className="flex gap-6 overflow-x-auto">
        {["Dentist", "Gynecologist", "Dietitian", "Physio"].map((s, i) => (
          <div key={i} className="bg-white min-w-[250px] rounded-xl shadow-md">
            <div className="h-40 bg-gray-300 rounded-t-xl"></div>
            <div className="p-4">
              <h2 className="font-semibold">{s}</h2>
              <p className="text-teal-600 mt-2">Book Appointment →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Articles() {
  return (
    <div className="px-10 mt-16 grid grid-cols-2 gap-10">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          Read top articles from health experts
        </h1>
        <button className="border border-teal-600 px-4 py-2 rounded-lg">
          See all articles
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-semibold">Coronavirus: Myths vs Facts</h2>
          <p className="text-gray-500 text-sm">By Dr. Krishna</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="font-semibold">Vitamins and Immunity</h2>
          <p className="text-gray-500 text-sm">By Dr. Amit</p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <div className="px-10 mt-16 text-center">
      <h1 className="text-3xl font-bold mb-6">What our users say</h1>
      <div className="bg-white p-10 rounded-xl shadow-md max-w-3xl mx-auto">
        <p className="text-gray-600">
          "Amazing platform. Easy to consult doctors online."
        </p>
        <h3 className="mt-4 font-semibold">Anjali Patel</h3>
      </div>
    </div>
  );
}

function FloatingButton() {
  return (
    <button className="fixed bottom-6 right-6 bg-teal-600 text-white px-5 py-3 rounded-full shadow-lg">
      💬 Health Assistant
    </button>
  );
}
