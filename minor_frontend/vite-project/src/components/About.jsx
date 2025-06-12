import React from "react";

const About = ({ language }) => {
  return (
    <section id="about" className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">
          {language === "en" ? "About the Project" : "परियोजना के बारे में"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === "en"
                ? "High Risk Areas"
                : "उच्च जोखिम वाले क्षेत्र"}
            </h3>
            <p className="text-gray-600">
              {language === "en"
                ? "Detect emerging slums using Health Data + Resources Availability + population data."
                : "स्वास्थ्य डेटा + संसाधनों की उपलब्धता + जनसंख्या डेटा का उपयोग करके उभरते झुग्गियों का पता लगाएं।"}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === "en" ? "Resource Availability" : "संसाधन उपलब्धता"}
            </h3>
            <p className="text-gray-600">
              {language === "en"
                ? "Check access to water, healthcare, schools & sanitation."
                : "जल, स्वास्थ्य सेवा, स्कूल और स्वच्छता की उपलब्धता जांचें।"}
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === "en" ? "Slum Growth Rate" : "झुग्गी वृद्धि दर"}
            </h3>
            <p className="text-gray-600">
              {language === "en"
                ? "Time-series models to predict future slum expansion."
                : "भविष्य की झुग्गी वृद्धि का पूर्वानुमान लगाने के लिए टाइम-सीरीज़ मॉडल।"}
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === "en" ? "Policy Recommendations" : "नीति सिफारिशें"}
            </h3>
            <p className="text-gray-600">
              {language === "en"
                ? "Generate insights for NGOs and governments."
                : "एनजीओ और सरकारों के लिए सिफारिशें उत्पन्न करें।"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
