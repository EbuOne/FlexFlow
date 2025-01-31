import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/components/forms/RegisterForm.module.css';

export default function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        birthDate: '',
        gender: '',
        address: '',
        tcNo: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        let tempErrors = {};
        
        if (!formData.firstName.trim()) {
            tempErrors.firstName = 'Ad alanı zorunludur';
        } else if (formData.firstName.length < 2) {
            tempErrors.firstName = 'Ad en az 2 karakter olmalıdır';
        }
        
        if (!formData.surname.trim()) {
            tempErrors.surname = 'Soyad alanı zorunludur';
        } else if (formData.surname.length < 2) {
            tempErrors.surname = 'Soyad en az 2 karakter olmalıdır';
        }

        if (!formData.tcNo.trim()) {
            tempErrors.tcNo = 'T.C. Kimlik No zorunludur';
        } else if (formData.tcNo.length !== 11) {
            tempErrors.tcNo = 'T.C. Kimlik No 11 haneli olmalıdır';
        }

        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            tempErrors.email = 'Geçerli bir email adresi giriniz';
        }
        if (formData.password.length < 6) {
            tempErrors.password = 'Şifre en az 6 karakter olmalıdır';
        }
        if (formData.password !== formData.confirmPassword) {
            tempErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }
        if (!formData.phoneNumber.match(/^[0-9]{10}$/)) {
            tempErrors.phoneNumber = 'Geçerli bir telefon numarası giriniz';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert('Kayıt başarılı!');
                    router.push('/login');
                } else {
                    const data = await response.json();
                    alert(data.message || 'Kayıt işlemi başarısız');
                }
            } catch (error) {
                console.error('Kayıt hatası:', error);
                alert('Bir hata oluştu');
            }
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Hesap Oluştur</h1>
                
                <div className={styles.section}>
                    <h2>Kişisel Bilgiler</h2>
                    
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Ad *"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? styles.error : ''}
                        />
                        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="middleName"
                            placeholder="İkinci Ad (Varsa)"
                            value={formData.middleName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="surname"
                            placeholder="Soyad *"
                            value={formData.surname}
                            onChange={handleChange}
                            className={errors.surname ? styles.error : ''}
                        />
                        {errors.surname && <span className={styles.errorText}>{errors.surname}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="tcNo"
                            placeholder="T.C. Kimlik No *"
                            value={formData.tcNo}
                            onChange={handleChange}
                            maxLength="11"
                            className={errors.tcNo ? styles.error : ''}
                        />
                        {errors.tcNo && <span className={styles.errorText}>{errors.tcNo}</span>}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>İletişim Bilgileri</h2>
                    
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="E-posta *"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.error : ''}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Telefon Numarası * (5XX XXX XXXX)"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={errors.phoneNumber ? styles.error : ''}
                        />
                        {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <textarea
                            name="address"
                            placeholder="Adres"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Hesap Bilgileri</h2>
                    
                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Şifre *"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? styles.error : ''}
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Şifre Tekrar *"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? styles.error : ''}
                        />
                        {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                    Hesap Oluştur
                </button>
            </form>
        </div>
    );
} 