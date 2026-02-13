"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants/products";

export function ProductGrid() {
  return (
    <div className="py-24 sm:py-32 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Un catalogue complet</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            18 types de Leads & RDV Qualifiés
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Des formulaires courts pour maximiser l&apos;intention de conversion sans friction.
            Disponible à l&apos;achat immédiat ou en flux récurrent.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product, idx) => (
              <Link key={product.id} href={`/leads/${product.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col bg-background p-6 rounded-2xl border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer h-full"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <product.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {product.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto text-sm">Leads et rendez-vous qualifiés disponibles dans votre zone d&apos;intervention.</p>
                    <p className="mt-6">
                      <span className="text-xs font-semibold px-2 py-1 bg-secondary rounded-full">{product.category}</span>
                    </p>
                  </dd>
                </motion.div>
              </Link>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
