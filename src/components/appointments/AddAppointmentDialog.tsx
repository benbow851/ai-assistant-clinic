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
import { useAddAppointment } from '@/hooks/use-appointment-mutations';
import type { AppointmentStatus, BookedVia } from '@/types/clinic';

const schema = z.object({
  customer_name: z.string().trim().min(1, 'กรุณากรอกชื่อลูกค้า').max(100),
  customer_phone: z.string().max(20).optional().or(z.literal('')),
  line_id: z.string().max(50).optional().or(z.literal('')),
  service_name: z.string().trim().min(1, 'กรุณาเลือกบริการ').max(200),
  staff_name: z.string().trim().min(1, 'กรุณาเลือกแพทย์').max(100),
  appointment_date: z.string().min(1, 'กรุณาเลือกวันนัด'),
  appointment_time: z.string().min(1, 'กรุณาเลือกเวลา'),
  price_estimate: z.coerce.number().min(0, 'ราคาต้องไม่ติดลบ').default(0),
  notes: z.string().max(1000).optional().or(z.literal('')),
  status: z.enum(['pending', 'confirmed']).default('pending'),
  booked_via: z.enum(['staff', 'phone', 'chatbot']).default('staff'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffNames: string[];
}

const generateAppointmentCode = () => {
  const ts = Date.now().toString();
  return 'BK' + ts.slice(-6);
};

const AddAppointmentDialog: React.FC<Props> = ({ open, onOpenChange, staffNames }) => {
  const addAppointment = useAddAppointment();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      line_id: '',
      service_name: '',
      staff_name: '',
      appointment_date: '',
      appointment_time: '',
      price_estimate: 0,
      notes: '',
      status: 'pending',
      booked_via: 'staff',
    },
  });

  const onSubmit = (values: FormValues) => {
    const code = generateAppointmentCode();
    const today = new Date().toISOString().slice(0, 10);

    addAppointment.mutate(
      {
        appointment_code: code,
        booking_date: today,
        customer_name: values.customer_name,
        customer_phone: values.customer_phone || null,
        line_id: values.line_id || null,
        service_name: values.service_name,
        staff_name: values.staff_name,
        appointment_date: values.appointment_date,
        appointment_time: values.appointment_time,
        price_estimate: values.price_estimate,
        notes: values.notes || null,
        status: values.status as AppointmentStatus,
        booked_via: values.booked_via as BookedVia,
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
          <DialogTitle className="font-retro text-xs text-white">➕ จองนัดใหม่</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="customer_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">ชื่อลูกค้า *</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="ชื่อ-นามสกุล" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="customer_phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">เบอร์โทร</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="081-xxx-xxxx" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="line_id" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">LINE ID</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="line_id" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="service_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">บริการ *</FormLabel>
                  <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="Botox Forehead" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="staff_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">แพทย์ *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="เลือกแพทย์" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a2233] border-white/10">
                      {staffNames.map(name => (
                        <SelectItem key={name} value={name} className="text-white">{name}</SelectItem>
                      ))}
                      <SelectItem value="__other" className="text-white/50">อื่นๆ (พิมพ์เอง)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="appointment_date" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">วันนัด *</FormLabel>
                  <FormControl><Input {...field} type="date" className="bg-white/5 border-white/10 text-white" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="appointment_time" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">เวลา *</FormLabel>
                  <FormControl><Input {...field} type="time" className="bg-white/5 border-white/10 text-white" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="price_estimate" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">ราคาประมาณ (฿)</FormLabel>
                  <FormControl><Input {...field} type="number" min={0} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" placeholder="0" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Row 5 */}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/70 text-xs">หมายเหตุ</FormLabel>
                <FormControl><Textarea {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[70px]" placeholder="หมายเหตุเพิ่มเติม..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Row 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">สถานะ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a2233] border-white/10">
                      <SelectItem value="pending" className="text-white">⏳ รอยืนยัน</SelectItem>
                      <SelectItem value="confirmed" className="text-white">✅ ยืนยัน</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="booked_via" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs">ช่องทางจอง</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a2233] border-white/10">
                      <SelectItem value="staff" className="text-white">👩‍⚕️ Staff</SelectItem>
                      <SelectItem value="phone" className="text-white">📞 Phone</SelectItem>
                      <SelectItem value="chatbot" className="text-white">🤖 Chatbot</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={addAppointment.isPending} className="bg-nerd-blue hover:bg-nerd-blue/80 text-white font-semibold">
                {addAppointment.isPending ? 'กำลังจอง...' : 'จองนัด'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
