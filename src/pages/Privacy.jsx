import React from 'react';
import Card from '../components/Card';

const Privacy = () => {
    return (
        <div className="container section-padding">
            <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
            <Card style={{ lineHeight: 1.8 }}>
                <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>Last Updated: {new Date().toLocaleDateString()}</p>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Data Collection</h3>
                <p style={{ marginBottom: '1rem' }}>
                    We collect personal information such as your name, email address, and resume content solely for the purpose of providing our analysis services. We do not aggregate this data for external sales.
                </p>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Use of AI</h3>
                <p style={{ marginBottom: '1rem' }}>
                    Our application uses Artificial Intelligence to process your resume. Your data is processed in ephemeral environments and is not used to train our core models without your explicit consent.
                </p>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Data Retention</h3>
                <p style={{ marginBottom: '1rem' }}>
                    You have full control over your data. You can request deletion of your account and all associated data at any time through your profile settings or by contacting support.
                </p>

                <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Third-Party Sharing</h3>
                <p>
                    We do not share your personal data with third-party advertisers. Limited data may be shared with trusted infrastructure providers (e.g., cloud hosting) strictly for operational purposes.
                </p>
            </Card>
        </div>
    );
};

export default Privacy;
