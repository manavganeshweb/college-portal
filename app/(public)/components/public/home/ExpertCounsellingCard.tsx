"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

import student1 from "@/assets/student1.png";

export default function ExpertCounsellingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.16 }}
      whileHover={{ y: -4 }}
      className="group relative min-h-[270px] overflow-hidden rounded-2xl border border-emerald-100 bg-[#edf8f5]"
    >
      {/* Soft background */}
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative h-full min-h-[270px] p-5 sm:p-6">
        {/* Content */}
        <div className="relative z-20 max-w-[245px]">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
            <MessageCircle className="h-4 w-4" />
          </div>

          <h3 className="text-xl font-bold leading-tight text-slate-900">
            Get Expert Counselling
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-600">
            Talk to our career experts and get personalized
            guidance.
          </p>

          <Link
            href="/qna"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Book a Counselling Session
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* =====================================================
            COUNSELLING SCENE
        ===================================================== */}
        <div className="pointer-events-none absolute bottom-0 right-0 h-[145px] w-[255px]">
          {/* Soft floor / background */}
          <div className="absolute bottom-0 left-5 right-0 h-20 rounded-t-[50%] bg-emerald-100/60" />

          {/* =================================================
              LEFT PERSON — STUDENT
          ================================================= */}
          <motion.div
            className="absolute bottom-[8px] left-[22px] h-[125px] w-[90px]"
            initial={{ y: 4 }}
            animate={{ y: [4, 0, 4] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Body shadow */}
            <div className="absolute bottom-0 left-4 h-8 w-16 rounded-full bg-slate-900/10 blur-md" />

            {/* Body */}
            <div className="absolute bottom-0 left-[18px] h-[78px] w-[62px] overflow-hidden rounded-t-[32px] bg-emerald-700">
              {/* Shirt highlight */}
              <div className="absolute left-3 top-2 h-14 w-4 rotate-[-8deg] rounded-full bg-emerald-500/50" />
            </div>

            {/* Neck */}
            <div className="absolute left-[43px] top-[39px] h-[15px] w-[17px] bg-[#d99f7d]" />

            {/* Face */}
            <div className="absolute left-[35px] top-[14px] h-[43px] w-[38px] rounded-[48%] bg-[#e2ad8c]">
              {/* Ear */}
              <div className="absolute -right-1 top-[17px] h-3 w-2 rounded-full bg-[#d79c7c]" />

              {/* Nose */}
              <div className="absolute right-[-2px] top-[22px] h-2 w-2 rounded-full bg-[#c98e70]" />

              {/* Eye */}
              <div className="absolute right-[8px] top-[20px] h-1 w-1 rounded-full bg-slate-800" />

              {/* Smile */}
              <div className="absolute right-[7px] top-[29px] h-[3px] w-[7px] rounded-full border-b border-slate-700" />
            </div>

            {/* Hair */}
            <div className="absolute left-[31px] top-[9px] h-[30px] w-[44px] overflow-hidden rounded-t-[22px] bg-slate-900">
              <div className="absolute -left-1 top-[20px] h-5 w-8 rounded-full bg-slate-900" />
            </div>

            {/* Hair side */}
            <div className="absolute left-[31px] top-[25px] h-[20px] w-[8px] rounded-full bg-slate-900" />

            {/* Arm reaching table */}
            <div className="absolute bottom-[42px] right-[1px] h-[43px] w-[11px] rotate-[-52deg] rounded-full bg-[#e2ad8c]" />

            {/* Hand */}
            <div className="absolute bottom-[67px] right-[-1px] h-[11px] w-[11px] rounded-full bg-[#e2ad8c]" />

            {/* Pants */}
            <div className="absolute bottom-0 left-[28px] h-[32px] w-[19px] rounded-b-lg bg-slate-700" />

            <div className="absolute bottom-0 left-[50px] h-[32px] w-[19px] rounded-b-lg bg-slate-700" />

            {/* Shoes */}
            <div className="absolute bottom-[-2px] left-[22px] h-3 w-7 rounded-full bg-slate-900" />

            <div className="absolute bottom-[-2px] left-[50px] h-3 w-7 rounded-full bg-slate-900" />
          </motion.div>

          {/* =================================================
              RIGHT PERSON — COUNSELLOR
          ================================================= */}
          <motion.div
            className="absolute bottom-[8px] right-[18px] h-[130px] w-[92px]"
            initial={{ y: 2 }}
            animate={{ y: [2, 0, 2] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Body shadow */}
            <div className="absolute bottom-0 left-3 h-8 w-20 rounded-full bg-slate-900/10 blur-md" />

            {/* Hair behind head */}
            <div className="absolute left-[31px] top-[5px] h-[58px] w-[47px] rounded-[45%] bg-slate-900">
              <div className="absolute -left-2 top-[20px] h-12 w-10 rounded-full bg-slate-900" />
              <div className="absolute right-[-3px] top-[22px] h-14 w-8 rounded-full bg-slate-900" />
            </div>

            {/* Neck */}
            <div className="absolute left-[43px] top-[40px] h-[16px] w-[17px] bg-[#e7b494]" />

            {/* Face */}
            <div className="absolute left-[34px] top-[12px] h-[44px] w-[39px] rounded-[48%] bg-[#edbd9f]">
              {/* Ear */}
              <div className="absolute -left-1 top-[18px] h-3 w-2 rounded-full bg-[#dda98c]" />

              {/* Eye */}
              <div className="absolute left-[8px] top-[21px] h-1 w-1 rounded-full bg-slate-800" />

              {/* Nose */}
              <div className="absolute left-[-1px] top-[23px] h-2 w-2 rounded-full bg-[#d49d80]" />

              {/* Smile */}
              <div className="absolute left-[8px] top-[30px] h-[3px] w-[8px] rounded-full border-b border-slate-700" />
            </div>

            {/* Hair front */}
            <div className="absolute left-[31px] top-[8px] h-[28px] w-[45px] rounded-t-[24px] bg-slate-950">
              <div className="absolute bottom-[-4px] left-0 h-6 w-7 rounded-full bg-slate-950" />
            </div>

            {/* Blazer */}
            <div className="absolute bottom-0 left-[18px] h-[82px] w-[64px] rounded-t-[27px] bg-slate-700">
              {/* Shirt */}
              <div className="absolute left-[25px] top-0 h-[55px] w-[17px] bg-white" />

              {/* Blazer lapels */}
              <div className="absolute left-[18px] top-1 h-[45px] w-[12px] -rotate-[15deg] bg-slate-500" />

              <div className="absolute right-[18px] top-1 h-[45px] w-[12px] rotate-[15deg] bg-slate-500" />
            </div>

            {/* Arm reaching forward */}
            <div className="absolute bottom-[45px] left-[3px] h-[48px] w-[12px] rotate-[55deg] rounded-full bg-slate-700" />

            {/* Hand */}
            <div className="absolute bottom-[73px] left-[-1px] h-[11px] w-[11px] rounded-full bg-[#edbd9f]" />

            {/* Skirt / lower body */}
            <div className="absolute bottom-0 left-[30px] h-[38px] w-[40px] rounded-b-xl bg-slate-800" />
          </motion.div>

          {/* =================================================
              TABLE
          ================================================= */}
          <div className="absolute bottom-[26px] left-[65px] right-[50px] z-10">
            {/* Table top */}
            <div className="h-2 rounded-full bg-slate-300 shadow-sm" />

            {/* Table front */}
            <div className="mx-auto h-[22px] w-[82%] rounded-b-lg bg-white/80 shadow-sm" />
          </div>

          {/* Laptop */}
          <div className="absolute bottom-[35px] left-[105px] z-20">
            <div className="h-[25px] w-[43px] rotate-[-7deg] rounded-[4px] border-2 border-slate-400 bg-white shadow-sm">
              <div className="m-[3px] h-[15px] rounded-sm bg-slate-100" />
            </div>

            <div className="absolute -bottom-1 left-[-4px] h-1 w-[51px] rounded-full bg-slate-400" />
          </div>
        </div>

        {/* Bottom label */}
        <p className="absolute bottom-4 left-5 z-30 text-[10px] font-medium text-emerald-700 sm:left-6">
          Free & Paid Services Available
        </p>
      </div>
    </motion.div>
  );
}