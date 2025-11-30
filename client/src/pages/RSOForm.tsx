import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PATENTES } from "@shared/constants";
import { VIATURAS_FLAT } from "@shared/viaturas";
import { CheckCircle2, Shield, ChevronRight, ChevronLeft, FileText, Users, Clock, AlertCircle } from "lucide-react";

const BRASAO_URL = "https://i.imgur.com/SQqg1Io.png";

export default function RSOForm() {
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const hiddenFormRef = useRef<HTMLFormElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nome_enviou: "",
    patente_enviou: "",
    prefixo: "",
    chefe_nome: "",
    chefe_patente: "",
    motorista_nome: "",
    motorista_patente: "",
    t3_nome: "",
    t3_patente: "",
    t4_nome: "",
    t4_patente: "",
    t5_nome: "",
    t5_patente: "",
    dataInicio: "",
    horarioInicio: "",
    dataFim: "",
    horarioFim: "",
    drogas_apreendidas: "0",
    armamento_apreendido: "0",
    lockpicks_apreendidas: "0",
    dinheiro_sujo_apreendido: "0",
    total_ocorrencias: "0",
    municao_apreendida: "0",
    bombas_apreendidas: "0",
    relacao_detidos_bo: "",
    acoes_realizadas: "",
    observacoes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formatDateTime = (date: string, time: string) => {
      if (!date || !time) return "";
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year} ${time}`;
    };

    const inicio = formatDateTime(formData.dataInicio, formData.horarioInicio);
    const fim = formatDateTime(formData.dataFim, formData.horarioFim);

    // Criar formulário oculto para submeter
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://boteco-production.up.railway.app/enviar";
    form.style.display = "none";

    const fields = {
      nome_enviou: formData.nome_enviou,
      patente_enviou: formData.patente_enviou,
      prefixo: formData.prefixo,
      chefe_nome: formData.chefe_nome,
      chefe_patente: formData.chefe_patente,
      motorista_nome: formData.motorista_nome,
      motorista_patente: formData.motorista_patente,
      t3_nome: formData.t3_nome,
      t3_patente: formData.t3_patente,
      t4_nome: formData.t4_nome,
      t4_patente: formData.t4_patente,
      t5_nome: formData.t5_nome,
      t5_patente: formData.t5_patente,
      inicio: inicio,
      fim: fim,
      drogas_apreendidas: formData.drogas_apreendidas || "0",
      armamento_apreendido: formData.armamento_apreendido || "0",
      lockpicks_apreendidas: formData.lockpicks_apreendidas || "0",
      dinheiro_sujo_apreendido: formData.dinheiro_sujo_apreendido || "0",
      total_ocorrencias: formData.total_ocorrencias || "0",
      municao_apreendida: formData.municao_apreendida || "0",
      bombas_apreendidas: formData.bombas_apreendidas || "0",
      relacao_detidos_bo: formData.relacao_detidos_bo,
      acoes_realizadas: formData.acoes_realizadas,
      observacoes: formData.observacoes,
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    setShowSuccess(true);
    
    setTimeout(() => {
      form.submit();
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6">
          <CheckCircle2 className="w-24 h-24 text-orange-500 mx-auto animate-pulse" />
          <div>
            <h2 className="text-4xl font-bold mb-2">Relatório Enviado!</h2>
            <p className="text-gray-400 text-lg">Seu relatório foi enviado com sucesso para o Discord.</p>
          </div>
        </div>
      </div>
    );
  }

  const stepIcons = [FileText, Users, Clock, AlertCircle];
  const StepIcon = stepIcons[step - 1];

  const stepTitles = [
    "Informações do Policial",
    "Informações da Viatura e Equipe",
    "Data e Horário de Patrulhamento",
    "Dados de Patrulhamento"
  ];

  const stepDescriptions = [
    "Preencha seus dados pessoais",
    "Informações da viatura e membros da equipe",
    "Período de patrulhamento",
    "Apreensões e ocorrências"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-orange-500/30 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={BRASAO_URL} alt="Brasão" className="w-14 h-14 drop-shadow-lg" />
              <div>
                <h1 className="text-2xl font-bold text-orange-500">Sistema RSO</h1>
                <p className="text-xs text-gray-400">3º Batalhão de Polícia de Choque Humaitá</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-400">
              <p className="font-semibold text-orange-500">Etapa {step} de 4</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    s <= step ? "bg-gradient-to-r from-orange-500 to-orange-600" : "bg-gray-700"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 rounded-full p-3">
                <StepIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{stepTitles[step - 1]}</h2>
                <p className="text-gray-400">{stepDescriptions[step - 1]}</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-orange-500/20">{step}</div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-gray-900/50 border-orange-500/20 backdrop-blur-sm shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Shield className="w-6 h-6" />
              {stepTitles[step - 1]}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white font-semibold mb-2 block">Nome Completo</Label>
                      <Input
                        name="nome_enviou"
                        value={formData.nome_enviou}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                        placeholder="Digite seu nome"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">Patente</Label>
                      <Select value={formData.patente_enviou} onValueChange={(value) => handleSelectChange("patente_enviou", value)}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20">
                          <SelectValue placeholder="Selecione a patente" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {PATENTES.map(patente => (
                            <SelectItem key={patente} value={patente} className="text-white hover:bg-orange-500/20">
                              <div className="flex items-center gap-2">
                                <img src={BRASAO_URL} alt="Brasão" className="w-4 h-4" />
                                {patente}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-white font-semibold mb-2 block">Prefixo da Viatura</Label>
                    <Select value={formData.prefixo} onValueChange={(value) => handleSelectChange("prefixo", value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20">
                        <SelectValue placeholder="Selecione o prefixo" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {VIATURAS_FLAT.map(viatura => (
                          <SelectItem key={viatura} value={viatura} className="text-white hover:bg-orange-500/20">
                            <div className="flex items-center gap-2">
                              <img src={BRASAO_URL} alt="Brasão" className="w-4 h-4" />
                              {viatura}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-orange-500 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Chefe de Barca
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white font-semibold mb-2 block">Patente</Label>
                        <Select value={formData.chefe_patente} onValueChange={(value) => handleSelectChange("chefe_patente", value)}>
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20">
                            <SelectValue placeholder="Selecione a patente" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {PATENTES.map(patente => (
                              <SelectItem key={patente} value={patente} className="text-white hover:bg-orange-500/20">
                                <div className="flex items-center gap-2">
                                  <img src={BRASAO_URL} alt="Brasão" className="w-4 h-4" />
                                  {patente}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white font-semibold mb-2 block">Nome</Label>
                        <Input
                          name="chefe_nome"
                          value={formData.chefe_nome}
                          onChange={handleInputChange}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                          placeholder="Digite o nome"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-orange-500 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Motorista
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white font-semibold mb-2 block">Patente</Label>
                        <Select value={formData.motorista_patente} onValueChange={(value) => handleSelectChange("motorista_patente", value)}>
                          <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20">
                            <SelectValue placeholder="Selecione a patente" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {PATENTES.map(patente => (
                              <SelectItem key={patente} value={patente} className="text-white hover:bg-orange-500/20">
                                <div className="flex items-center gap-2">
                                  <img src={BRASAO_URL} alt="Brasão" className="w-4 h-4" />
                                  {patente}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-white font-semibold mb-2 block">Nome</Label>
                        <Input
                          name="motorista_nome"
                          value={formData.motorista_nome}
                          onChange={handleInputChange}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                          placeholder="Digite o nome"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {[
                    { key: "t3", label: "3º Homem" },
                    { key: "t4", label: "4º Homem" },
                    { key: "t5", label: "5º Homem" }
                  ].map(({ key, label }) => (
                    <div key={key} className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold text-orange-500 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {label}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white font-semibold mb-2 block">Patente</Label>
                          <Select value={formData[`${key}_patente` as keyof typeof formData]} onValueChange={(value) => handleSelectChange(`${key}_patente`, value)}>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20">
                              <SelectValue placeholder="Selecione a patente" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {PATENTES.map(patente => (
                                <SelectItem key={patente} value={patente} className="text-white hover:bg-orange-500/20">
                                  <div className="flex items-center gap-2">
                                    <img src={BRASAO_URL} alt="Brasão" className="w-4 h-4" />
                                    {patente}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white font-semibold mb-2 block">Nome</Label>
                          <Input
                            name={`${key}_nome`}
                            value={formData[`${key}_nome` as keyof typeof formData]}
                            onChange={handleInputChange}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                            placeholder="Digite o nome"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                    <p className="text-orange-400 text-sm">Defina o período de patrulhamento</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white font-semibold mb-2 block">Data de Início</Label>
                      <Input
                        type="date"
                        name="dataInicio"
                        value={formData.dataInicio}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">Horário de Início</Label>
                      <Input
                        type="time"
                        name="horarioInicio"
                        value={formData.horarioInicio}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">Data de Fim</Label>
                      <Input
                        type="date"
                        name="dataFim"
                        value={formData.dataFim}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20"
                        required
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">Horário de Fim</Label>
                      <Input
                        type="time"
                        name="horarioFim"
                        value={formData.horarioFim}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                    <p className="text-orange-400 text-sm">Registre as apreensões e ocorrências da patrulha</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white font-semibold mb-2 block">📋 Ocorrências Atendidas</Label>
                      <Input
                        type="number"
                        name="total_ocorrencias"
                        value={formData.total_ocorrencias}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">💊 Drogas Apreendidas</Label>
                      <Input
                        type="number"
                        name="drogas_apreendidas"
                        value={formData.drogas_apreendidas}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">💵 Dinheiro Sujo</Label>
                      <Input
                        type="number"
                        name="dinheiro_sujo_apreendido"
                        value={formData.dinheiro_sujo_apreendido}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">🔫 Armamentos</Label>
                      <Input
                        type="number"
                        name="armamento_apreendido"
                        value={formData.armamento_apreendido}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">💣 Munição</Label>
                      <Input
                        type="number"
                        name="municao_apreendida"
                        value={formData.municao_apreendida}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">💥 Bombas</Label>
                      <Input
                        type="number"
                        name="bombas_apreendidas"
                        value={formData.bombas_apreendidas}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-semibold mb-2 block">🛠 Lockpicks</Label>
                      <Input
                        type="number"
                        name="lockpicks_apreendidas"
                        value={formData.lockpicks_apreendidas}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <Label className="text-white font-semibold mb-2 block">📄 Relação de Detidos e B.O</Label>
                    <Textarea
                      name="relacao_detidos_bo"
                      value={formData.relacao_detidos_bo}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                      placeholder="Digite informações sobre detidos e B.O's..."
                      rows={3}
                    />
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <Label className="text-white font-semibold mb-2 block">🛡 Ações Realizadas pela Equipe</Label>
                    <Textarea
                      name="acoes_realizadas"
                      value={formData.acoes_realizadas}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                      placeholder="Descreva as ações realizadas pela equipe..."
                      rows={3}
                    />
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <Label className="text-white font-semibold mb-2 block">🗒 Observações</Label>
                    <p className="text-gray-400 text-sm mb-3">(Modelo de armamento apreendido, Tipo de droga apreendida)</p>
                    <Textarea
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                      placeholder="Digite as observações..."
                      rows={5}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Voltar
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    Próximo
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Enviar Relatório
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-500/30 bg-black/50 backdrop-blur-sm mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-orange-500 font-semibold mb-2">Sobre</h3>
              <p className="text-gray-400 text-sm">Sistema de Relatórios de Serviço Operacional do 3º BPChq Humaitá</p>
            </div>
            <div>
              <h3 className="text-orange-500 font-semibold mb-2">Contato</h3>
              <p className="text-gray-400 text-sm">3º Batalhão de Polícia de Choque<br />Humaitá - Amazonas</p>
            </div>
            <div>
              <h3 className="text-orange-500 font-semibold mb-2">Suporte</h3>
              <p className="text-gray-400 text-sm">Para dúvidas, entre em contato com o RH</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            <p>© 2025 3º Batalhão de Polícia de Choque Humaitá - Sistema RSO | Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
