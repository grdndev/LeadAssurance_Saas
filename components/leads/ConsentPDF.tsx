import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
    header: { marginBottom: 30, borderBottomWidth: 2, borderBottomColor: '#2563eb', paddingBottom: 10 },
    title: { fontSize: 20, color: '#2563eb', fontWeight: 'bold' },
    section: { marginVertical: 15 },
    label: { fontWeight: 'bold', color: '#666', marginBottom: 5 },
    value: { fontSize: 12, marginBottom: 10, padding: 8, backgroundColor: '#f9fafb' },
    metaBox: { marginTop: 30, padding: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
    hash: { fontSize: 8, color: '#999', marginTop: 10, fontFamily: 'Courier' }
});

interface ConsentPDFProps {
    lead: any;
    consent: any;
}

export const ConsentPDF: React.FC<ConsentPDFProps> = ({ lead, consent }) => (
    <Document title={`Certificat_Consentement_${lead.id}`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>CERTIFICAT DE CONSENTEMENT RGPD</Text>
                <Text>ID Certificat: {consent.id}</Text>
                <Text>Date de Signature: {new Date(consent.timestamp).toLocaleString('fr-FR')}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>IDENTITÉ DU PROSPECT</Text>
                <Text style={styles.value}>{lead.firstName} {lead.lastName}</Text>
                <Text style={styles.label}>EMAIL & TÉLÉPHONE</Text>
                <Text style={styles.value}>{lead.email} | {lead.phone}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>TEXTE DE CONSENTEMENT ACCEPTÉ</Text>
                <Text style={{ fontSize: 10, fontStyle: 'italic', padding: 10, backgroundColor: '#f3f4f6' }}>
                    "{consent.consentText}"
                </Text>
            </View>

            <View style={styles.metaBox}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>MÉTADONNÉES DE PREUVE</Text>
                <Text>Adresse IP : {consent.ipAddress}</Text>
                <Text>User-Agent : {consent.userAgent}</Text>
                <Text>URL Source : {consent.urlSource}</Text>
                <Text>Horodatage : {consent.timestamp}</Text>
                <Text style={styles.hash}>EMPREINTE NUMÉRIQUE SHA-256 : {consent.proofHash || 'ARCHIVED_SECURE_HASH'}</Text>
            </View>

            <View style={{ marginTop: 50, textAlign: 'center', fontSize: 8, color: '#999' }}>
                <Text>Ce document constitue une preuve légale de consentement conformément au RGPD.</Text>
                <Text>Généré par LeadsAssurance.com - Plateforme de mise en relation certifiée.</Text>
            </View>
        </Page>
    </Document>
);
