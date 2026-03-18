import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAddCustomer } from '@/hooks/use-customer-mutations';
import type { MembershipStatus } from '@/types/clinic';

const schema = z.object({
  full_name: z.string().trim().min(1, 'กรุณากรอกชื่อ').max(100),
  customer_code: z.string().trim().min(1, 'กรุณากรอกรหัสลูกค้า').max(20),
  phone: z.string().max(20).optional().or(z.literal('')),
  line_id: z.string().max(50).optional().or(z.literal('')),
  email: z.string().email('อีเมลไม่ถูกต้อง').max(255).optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  membership_status: z.enum(['new', 'silver', 'gold', 'diamond']).default('new'),
  favorite_services: z.string().max(500).optional().or(z.literal('')),
  allergies: z.string().max(500).optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCustomerDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const addCustomer = useAddCustomer();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      customer_code: '',
      phone: '',
      line_id: '',
      email: '',
      gender: '',
      date_of_birth: '',
      membership_status: 'new',
      favorite_services: '',
      allergies: '',
      notes: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    addCustomer.mutate(
      {
        full_name: values.full_name,
        customer_code: values.customer_code,
        phone: values.phone || null,
        line_id: values.line_id || null,
        email: values.email || null,
        gender: values.gender || null,
        date_of_birth: values.date_of_birth || null,
        age: null,
        first_visit_date: null,
        total_visits: 0,
        favorite_services: values.favorite_services || null,
        total_purchase: 0,
        membership_status: values.membership_status as MembershipStatus,
        allergies: values.allergies || null,
        notes: values.notes || null,
        is_active: true,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#1a2233] border-white/10 text-white font-poppins">
        <DialogHeader>
          <DialogTitle className="font-retro text-xs text-white">➕ เพิ่มลูกค้าใหม่</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="full_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">ชื่อ-นามสกุล *</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="ชื่อเต็ม" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="customer_code" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">รหัสลูกค้า *</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="C-0001" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">เบอร์โทร</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="081-xxx-xxxx" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="line_id" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">LINE ID</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="line_id" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">อีเมล</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="email@example.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">เพศ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="เลือกเพศ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a2233] border-white/10">
                      <SelectItem value="ชาย" className="text-white">ชาย</SelectItem>
                      <SelectItem value="หญิง" className="text-white">หญิง</SelectItem>
                      <SelectItem value="อื่นๆ" className="text-white">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="date_of_birth" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">วันเกิด</FormLabel>
                  <FormControl><Input {...field} type="date" className="bg-white/5 border-white/10 text-white" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="membership_status" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">สถานะสมาชิก</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a2233] border-white/10">
                      <SelectItem value="new" className="text-white">🆕 New</SelectItem>
                      <SelectItem value="silver" className="text-white">🥈 Silver</SelectItem>
                      <SelectItem value="gold" className="text-white">🥇 Gold</SelectItem>
                      <SelectItem value="diamond" className="text-white">💎 Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="favorite_services" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">บริการที่ชอบ</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="Botox, Filler..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="allergies" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">อาการแพ้</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="ไม่มี" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 6 */}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70 text-xs">หมายเหตุ</FormLabel>
                <FormControl><Textarea {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]" placeholder="หมายเหตุเพิ่มเติม..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={addCustomer.isPending} className="bg-nerd-blue hover:bg-nerd-blue/80 text-white font-semibold">
                {addCustomer.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
