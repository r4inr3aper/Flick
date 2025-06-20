import { useState, useEffect } from 'react';
import styles from './Promo.module.scss';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../assets/assets';

const Promo = () => {
  const [promos, setPromos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validUntil: ''
  });

  const fetchPromos = async () => {
    try {
      const response = await axios.get(url + "/api/promo/list");
      if (response.data.success) {
        setPromos(response.data.data);
        if (response.data.data.length === 0) {
          toast.info("No promo codes found");
        }
      } else {
        toast.error("Failed to load promo codes");
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast.error("Unable to connect to server");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.code.trim()) {
      toast.error("Please enter a promo code");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!formData.discountValue || formData.discountValue <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }
    if (!formData.validUntil) {
      toast.error("Please select an expiry date");
      return;
    }

    try {
      toast.info("Creating promo code...");
      const response = await axios.post(url + "/api/promo/add", formData);
      if (response.data.success) {
        toast.success("Promo code created successfully!");
        setFormData({
          code: '',
          description: '',
          discountType: 'percentage',
          discountValue: '',
          minOrderAmount: '',
          maxDiscount: '',
          usageLimit: '',
          validUntil: ''
        });
        setShowForm(false);
        fetchPromos();
      } else {
        toast.error(response.data.message || "Failed to create promo code");
      }
    } catch (error) {
      console.error("Error adding promo code:", error);
      toast.error("Unable to create promo code. Please try again.");
    }
  };

  const togglePromoStatus = async (id) => {
    try {
      toast.info("Updating promo status...");
      const response = await axios.post(url + "/api/promo/toggle", { id });
      if (response.data.success) {
        toast.success("Promo status updated successfully");
        fetchPromos();
      } else {
        toast.error("Failed to update promo status");
      }
    } catch (error) {
      toast.error("Unable to update promo status");
      console.error("Toggle promo error:", error);
    }
  };

  const deletePromo = async (id) => {
    try {
      toast.info("Deleting promo code...");
      const response = await axios.post(url + "/api/promo/delete", { id });
      if (response.data.success) {
        toast.success("Promo code deleted successfully");
        fetchPromos();
      } else {
        toast.error("Failed to delete promo code");
      }
    } catch (error) {
      toast.error("Unable to delete promo code");
      console.error("Delete promo error:", error);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Promo Code Management</h1>
        <p>Create and manage promotional discount codes (latest first)</p>
        <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
          {showForm ? 'Cancel' : 'Add New Promo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <h3>Create New Promo Code</h3>
          </div>

          <div className={styles.formContent}>
            <div className={styles.formGrid}>
              <input
                type="text"
                name="code"
                placeholder="Promo Code (e.g., SAVE20)"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
                required
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount Discount</option>
              </select>
              <input
                type="number"
                name="discountValue"
                placeholder={formData.discountType === 'percentage' ? 'Discount % (e.g., 20)' : 'Discount Amount (e.g., 5)'}
                value={formData.discountValue}
                onChange={handleInputChange}
                required
                min="0"
                max={formData.discountType === 'percentage' ? '100' : undefined}
              />
              <input
                type="number"
                name="minOrderAmount"
                placeholder="Min Order Amount (optional)"
                value={formData.minOrderAmount}
                onChange={handleInputChange}
                min="0"
              />
              <input
                type="number"
                name="maxDiscount"
                placeholder="Max Discount (optional)"
                value={formData.maxDiscount}
                onChange={handleInputChange}
                min="0"
              />
              <input
                type="number"
                name="usageLimit"
                placeholder="Usage Limit (optional)"
                value={formData.usageLimit}
                onChange={handleInputChange}
                min="1"
              />
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                Create Promo
              </button>
            </div>
          </div>
        </form>
      )}

      <div className={styles.promoList}>
        {promos.length === 0 ? (
          <div className={styles.noPromos}>
            <h3>No promo codes found</h3>
            <p>No promotional codes have been created yet.</p>
          </div>
        ) : (
          promos.map((promo) => (
            <div key={promo._id} className={styles.promoCard}>
              <div className={styles.promoHeader}>
                <div className={styles.promoInfo}>
                  <h3>{promo.code}</h3>
                  <span className={styles.description}>{promo.description}</span>
                </div>
                <div className={styles.promoDiscount}>
                  <span className={styles.discount}>
                    {promo.discountType === 'percentage'
                      ? `${promo.discountValue}%`
                      : `$${promo.discountValue}`}
                  </span>
                  <span className={promo.isActive ? styles.active : styles.inactive}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className={styles.promoContent}>
                <div className={styles.promoDetails}>
                  <h4>Details</h4>
                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>Min Order:</span>
                      <span className={styles.value}>${promo.minOrderAmount || 'No minimum'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>Usage:</span>
                      <span className={styles.value}>{promo.usedCount}/{promo.usageLimit || '∞'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>Valid Until:</span>
                      <span className={styles.value}>{new Date(promo.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.actionSection}>
                  <h4>Actions</h4>
                  <div className={styles.actions}>
                    <button
                      onClick={() => togglePromoStatus(promo._id)}
                      className={styles.toggleBtn}
                    >
                      {promo.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deletePromo(promo._id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Promo;
