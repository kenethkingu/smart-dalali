import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle, Upload, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton, GhostButton } from '@/components/shared/Bits'
import { properties } from '@/data/mockData'

type Step = 1 | 2 | 3

const AMENITIES = [
  'Electricity', 'Water Supply', 'Fenced Compound', 'Parking Space',
  '24/7 Security', 'Garden', 'Balcony', 'Title Deed', 'Paved Access Road',
  'Backup Generator', 'Furnished', 'Air Conditioning', 'High-speed Internet'
]

interface FormData {
  purpose: 'rent' | 'sale'
  type: 'house' | 'plot' | 'office'
  location: string
  price: string
  bedrooms: string
  areaSqm: string
  description: string
  amenities: string[]
  photos: File[]
}

const defaultForm: FormData = {
  purpose: 'rent', type: 'house', location: '', price: '',
  bedrooms: '', areaSqm: '', description: '', amenities: [], photos: [],
}

export function PropertyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isEdit = Boolean(id)
  
  const existingProperty = isEdit ? properties.find(p => p.id === id) : null
  
  if (isEdit && !existingProperty) {
    navigate('/404', { replace: true })
    return null
  }

  const [step, setStep] = useState<Step>(1)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormData>(existingProperty ? {
    purpose: existingProperty.purpose,
    type: existingProperty.type,
    location: existingProperty.location,
    price: String(existingProperty.price),
    bedrooms: existingProperty.bedrooms ? String(existingProperty.bedrooms) : '',
    areaSqm: existingProperty.areaSqm ? String(existingProperty.areaSqm) : '',
    description: existingProperty.description,
    amenities: existingProperty.amenities,
    photos: []
  } : defaultForm)

  const set = (key: keyof FormData, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const toggleAmenity = (a: string) =>
    set('amenities', form.amenities.includes(a)
      ? form.amenities.filter(x => x !== a)
      : [...form.amenities, a])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    set('photos', [...form.photos, ...files].slice(0, 8))
  }

  const removePhoto = (i: number) =>
    set('photos', form.photos.filter((_, idx) => idx !== i))

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center text-pl-text">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-pl-accent" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-pl-text mb-3">{t('status.approved')}!</h2>
          <p className="text-pl-muted mb-8">
            {t('owner_dashboard.subtitle')}
          </p>
          <PrimaryButton onClick={() => navigate('/owner/dashboard')} className="h-12 px-8">
            {t('common.back')} {t('nav.dashboard')}
          </PrimaryButton>
        </motion.div>
      </div>
    )
  }

  const stepLabel = [t('hero.filter.all'), t('common.details'), 'Photos']

  return (
    <div className="max-w-2xl text-pl-text">
      <h1 className="text-3xl font-heading font-bold text-pl-text mb-2">
        {isEdit ? t('owner_dashboard.form.title_edit') : t('owner_dashboard.form.title_add')}
      </h1>
      <p className="text-pl-muted mb-8">
        {t('owner_dashboard.subtitle')}
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {stepLabel.map((label, i) => {
          const s = (i + 1) as Step
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${step === s ? 'bg-pl-accent text-white' : step > s ? 'bg-pl-accent/80 text-white' : 'bg-pl-surface text-pl-muted border border-pl-line'}`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${step === s ? 'text-pl-text font-bold' : 'text-pl-muted'}`}>{label}</span>
              {i < 2 && <div className="flex-1 h-px bg-pl-line w-8 mx-1" />}
            </div>
          )
        })}
      </div>

      <div className="bg-pl-surface text-pl-text rounded-2xl border border-pl-line p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-pl-text">Step 1: {t('owner_dashboard.form.purpose')}</h2>
              <div>
                <label className="block text-sm font-semibold text-pl-text mb-2">{t('owner_dashboard.form.purpose')}</label>
                <div className="flex gap-3">
                  {(['rent', 'sale'] as const).map(p => (
                    <button key={p} type="button" onClick={() => set('purpose', p)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all capitalize
                        ${form.purpose === p ? 'border-pl-accent bg-pl-accent text-white' : 'border-pl-line bg-pl-bg text-pl-muted hover:border-pl-accent'}`}>
                      {t(`hero.filter.${p === 'rent' ? 'rent' : 'buy'}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-pl-text mb-2">{t('owner_dashboard.form.type')}</label>
                <div className="flex gap-3">
                  {(['house', 'plot', 'office'] as const).map(tType => (
                    <button key={tType} type="button" onClick={() => set('type', tType)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all capitalize
                        ${form.type === tType ? 'border-pl-accent bg-pl-accent text-white' : 'border-pl-line bg-pl-bg text-pl-muted hover:border-pl-accent'}`}>
                      {t(`hero.filter.${tType === 'house' ? 'houses' : tType === 'plot' ? 'plots' : 'offices'}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-pl-text mb-2">{t('owner_dashboard.form.location')}</label>
                <input required type="text" value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Masaki, Dar es Salaam"
                  className="w-full bg-pl-bg text-pl-text placeholder:text-pl-muted border border-pl-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pl-accent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-pl-text mb-2">
                  {t('owner_dashboard.form.price')}
                </label>
                <input required type="number" value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="e.g. 900000"
                  className="w-full bg-pl-bg text-pl-text placeholder:text-pl-muted border border-pl-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pl-accent" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-pl-text">Step 2: {t('common.details')}</h2>
              {form.type === 'house' && (
                <div>
                  <label className="block text-sm font-semibold text-pl-text mb-2">{t('owner_dashboard.form.bedrooms')}</label>
                  <div className="flex gap-2">
                    {['1', '2', '3', '4', '5+'].map(b => (
                      <button key={b} type="button" onClick={() => set('bedrooms', b)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all
                          ${form.bedrooms === b ? 'border-pl-accent bg-pl-accent text-white' : 'border-pl-line bg-pl-bg text-pl-muted'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-pl-text mb-2">{t('owner_dashboard.form.size')}</label>
                <input type="number" value={form.areaSqm} onChange={e => set('areaSqm', e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full bg-pl-bg text-pl-text placeholder:text-pl-muted border border-pl-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pl-accent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-pl-text mb-2">{t('owner_dashboard.form.description')}</label>
                <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder={t('owner_dashboard.form.desc_ph')}
                  className="w-full bg-pl-bg text-pl-text placeholder:text-pl-muted border border-pl-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pl-accent resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-pl-text mb-3">{t('owner_dashboard.form.amenities')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.slice(0, showAllAmenities ? AMENITIES.length : 6).map(a => (
                    <label key={a} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)}
                        className="w-4 h-4 accent-pl-accent" />
                      <span className="text-sm text-pl-text group-hover:text-pl-accent transition-colors">{t(`properties.amenities_list.${a}`, a)}</span>
                    </label>
                  ))}
                </div>
                {AMENITIES.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="text-sm font-bold text-pl-accent hover:underline transition-colors mt-4 block"
                  >
                    {showAllAmenities ? t('properties.show_less') : t('properties.show_more')}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-pl-text">Step 3: {t('owner_dashboard.form.images')}</h2>
              <p className="text-sm text-pl-muted">{t('owner_dashboard.form.images')}</p>

              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-pl-line rounded-2xl cursor-pointer hover:border-pl-accent transition-colors bg-pl-bg">
                <Upload className="w-8 h-8 text-pl-muted mb-2" />
                <span className="text-sm font-semibold text-pl-muted">Click to upload photos</span>
                <span className="text-xs text-pl-muted mt-1">JPG, PNG up to 10MB each</span>
                <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>

              {form.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {form.photos.map((file, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-pl-bg border border-pl-line group">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-pl-line">
          <GhostButton onClick={() => step > 1 ? setStep((step - 1) as Step) : navigate('/owner/dashboard')}
            className="px-5 border border-pl-line text-pl-text">
            <ChevronLeft className="w-4 h-4" /> {step > 1 ? t('common.back') : t('common.cancel')}
          </GhostButton>

          {step < 3 ? (
            <PrimaryButton onClick={() => setStep((step + 1) as Step)} className="px-6">
              Next <ChevronRight className="w-4 h-4" />
            </PrimaryButton>
          ) : (
            <PrimaryButton disabled={isSubmitting} onClick={handleSubmit} className="px-6">
              {isSubmitting ? t('common.loading') : (isEdit ? t('owner_dashboard.form.submit_edit') : t('owner_dashboard.form.submit_add'))} {!isSubmitting && <CheckCircle className="w-4 h-4" />}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  )
}
