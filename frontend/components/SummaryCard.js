import styles from './SummaryCard.module.css';

export default function SummaryCard({ label, value })
{
   const getColorClass = () =>
   {
      const text = label.toLowerCase();

      if (text.includes('income')) return styles.income;
      if (text.includes('expense')) return styles.expense;
      if (text.includes('balance')) return styles.balance;

      return styles.default;
   };

   return (
      <div className={styles.card}>
         <p className={styles.label}>
            {label}
         </p>

         <p className={`${styles.value} ${getColorClass()}`}>
            {value}
         </p>
      </div>
   );
}