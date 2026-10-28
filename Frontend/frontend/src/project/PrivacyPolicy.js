import React from "react";
import "../projectCss/PrivacyPolicy.css"


const PrivacyPolicy = () => {
  return (
    <div className="privacy-wrapper">
      {/* Top Title */}
      <div className="top-title">
        <h1>PRIVACY POLICY</h1>
      </div>

      <div className="content-box">
        <h2 className="main-heading">Sample Privacy Policy Template</h2>

        <div className="text-content">
          <p>
            A Privacy Policy is a legal statement found on a website or app that outlines explicit details on how it will use personal data provided by users. Such personal data may include details like names, addresses, phone numbers, date of birth or data related to one’s financial information like credit card details.
          </p>
          <p>
            Other than outlining how your website will use the data, a Privacy Policy also describes the legal obligations you have if you fail to meet stipulated responsibilities as the website owner.
          </p>
          <p>
            As a business owner who’s considering putting up a website, this article will give you a basic understanding of why you need to have a Privacy Policy and how you should incorporate one.
          </p>
          <p>
            As part of an array of privacy laws available across the globe, if your website will collect user information, you are legally required to have a Privacy Policy in place.
          </p>
          <p>
            If you are a resident member of the EU, having a Privacy Policy shows compliance with the General Data Protection Regulation (GDPR). Failure to comply with this EU regulation can lead to a fine of up to 20 million Euros according to Intersoft Consulting.
          </p>
          <p>
            The U.S., on the other hand, doesn’t have a singular governing data protection legislation. Rather, the U.S. uses a combination of related data privacy laws at the federal and state level. For instance, the Federal Trade Commission Act (FTCA) empowers the Federal Trade Commission to enforce privacy and data protection laws in federal jurisdiction. On the other hand, the California Online Privacy Protection Act (CalOPPA) is one such data privacy law which protects users with residency in California.
          </p>
          <p>
            A Privacy Policy also instils trust into users that their information is safe from unrelated parties. If not, you might be liable to legal repercussions. In general, a Privacy policy further legitimises your business by ensuring all the parties involved are part of a legally binding agreement.
          </p>
          <p>
            Having a strong Privacy Policy also offers a substantial competitive advantage. We don’t precisely understand how Google’s search algorithm works, but the biggest consensus is that if Google trusts your business, the higher your chances of appearing on its first search results pages.
          </p>
          <p>
            According to Woorank, most SEO experts believe that a website’s privacy policy has a pivotal role to play in how Google and other search engines ultimately identify you as “trust-worthy.”
          </p>
        </div>

        {/* Section */}
        <h2 className="section-heading">What to Include in Your Privacy Policy</h2>
        <p className="section-intro">
          The content of your Privacy Policy will largely depend on the function of your website, the information gathered and how you intend to use said information. However, to pass legal standards, all Privacy policies should have these basic elements within the text.
        </p>

        <div className="policy-block">
          <h3>Your Business Contact Information</h3>
          <p>
            Your Privacy Policy needs to display your organization details like the legal name, contact details and place of business. Best practice recommends that this part should appear as the first or the last part of your Privacy Policy for visibility.
          </p>
        </div>

        <div className="policy-block">
          <h3>The Type of Data You Will Collect</h3>
          <p>
            This ranges from emails, physical and IP addresses, credit card details, phone numbers or tracking locations. CalOPPA goes a step further to mandate that commercial or online websites collecting information on California residents must categorically list the type of personal information collected.
          </p>
        </div>

        <div className="policy-block">
          <h3>How You Will Collect the Information</h3>
          <p>
            In addition to filling out forms, you can also collect data automatically through the use of cookies. Internet cookies are, by far, the easiest way to collect user data since browsers collect and save information from an array of sites users have previously visited. However, you must also obtain consent from users to use their cookies when collecting information.
          </p>
        </div>

        <div className="policy-block">
          <h3>How You Intend to Use the Data</h3>
          <p>
            A vital element of a Privacy Policy is describing how you intend to use the data collected. This clause is particularly important if third-parties like advertising programs or fintech companies are in the loop.
          </p>
          <p>
            Will you use the data for transactional purposes alone or will you also send newsletters to your visitors? Will your company share information with other third-party entities like merchants? If so, the law legally requires you to list down all the relevant parties who will also have access to user information alongside your business.
          </p>
          <p>
            In Quora’s Privacy Policy, they have explained in great detail how they intend to use user information, and even further clarifying that they do not sell to third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;