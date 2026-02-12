import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        color: '#2563eb',
        fontWeight: 'bold',
    },
    companyInfo: {
        marginBottom: 20,
    },
    customerInfo: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        color: '#666',
    },
    table: {
        display: 'table' as any,
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 40,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableHeader: {
        backgroundColor: '#f9fafb',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 10,
    },
    colDesc: { width: '60%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '25%', textAlign: 'right' },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalLabel: {
        width: '100px',
        textAlign: 'right',
        paddingRight: 10,
        fontSize: 12,
        fontWeight: 'bold',
    },
    totalAmount: {
        width: '100px',
        textAlign: 'right',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        color: '#999',
    }
});

interface InvoiceProps {
    transaction: any;
    user: any;
}

export const InvoicePDF: React.FC<InvoiceProps> = ({ transaction, user }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>INVOICE</Text>
                    <Text>Facture N° {transaction.id.substring(0, 8).toUpperCase()}</Text>
                    <Text>Date: {new Date(transaction.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={{ textAlign: 'right' }}>
                    <Text style={{ fontWeight: 'bold' }}>LeadsAssurance SaaS</Text>
                    <Text>123 Avenue des Leads</Text>
                    <Text>75008 Paris, France</Text>
                    <Text>contact@leadsassurance.com</Text>
                </View>
            </View>

            <View style={styles.customerInfo}>
                <Text style={styles.sectionTitle}>Facturé à :</Text>
                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{user.name}</Text>
                <Text>{user.email}</Text>
                {/* Add more user info if available like company, address */}
            </View>

            <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={styles.colDesc}><Text style={styles.tableCell}>Description</Text></View>
                <View style={styles.colQty}><Text style={styles.tableCell}>Crédits</Text></View>
                <View style={styles.colPrice}><Text style={styles.tableCell}>Prix HT</Text></View>
            </View>

            <View style={styles.tableRow}>
                <View style={styles.colDesc}>
                    <Text style={styles.tableCell}>{transaction.description}</Text>
                </View>
                <View style={styles.colQty}>
                    <Text style={styles.tableCell}>{transaction.credits}</Text>
                </View>
                <View style={styles.colPrice}>
                    <Text style={styles.tableCell}>{transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</Text>
                </View>
            </View>

            <View style={{ marginTop: 20 }}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total HT:</Text>
                    <Text style={styles.totalAmount}>{transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</Text>
                </View>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>TVA (20%):</Text>
                    <Text style={styles.totalAmount}>{(transaction.amount * 0.2).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</Text>
                </View>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total TTC:</Text>
                    <Text style={styles.totalAmount}>{(transaction.amount * 1.2).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text>LeadAssurance SAS - RCS Paris B 123 456 789 - TVA Intraco FR123456789</Text>
                <Text>Merci de votre confiance !</Text>
            </View>
        </Page>
    </Document>
);
